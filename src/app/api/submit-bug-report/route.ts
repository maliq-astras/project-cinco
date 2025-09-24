import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface BugReportData {
  bugType: string[];
  deviceType: string;
  bugDetails: string;
  file?: File | null;
}

export async function POST(request: NextRequest) {
  try {
    // Parse form data (handles file uploads)
    const formData = await request.formData();

    const bugTypeRaw = formData.get('bugType') as string;
    const deviceType = formData.get('deviceType') as string;
    const bugDetails = formData.get('bugDetails') as string;
    const file = formData.get('file') as File | null;

    // Parse bug types (sent as JSON string)
    let bugType: string[] = [];
    if (bugTypeRaw) {
      try {
        bugType = JSON.parse(bugTypeRaw);
      } catch (e) {
        bugType = [bugTypeRaw];
      }
    }

    // Validation
    if (!bugType || bugType.length === 0) {
      return NextResponse.json({ error: 'Bug type is required' }, { status: 400 });
    }

    if (!deviceType) {
      return NextResponse.json({ error: 'Device type is required' }, { status: 400 });
    }

    if (!bugDetails || bugDetails.trim().length === 0) {
      return NextResponse.json({ error: 'Bug details are required' }, { status: 400 });
    }

    // Prepare attachments
    const attachments = [];
    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      attachments.push({
        filename: file.name,
        content: buffer,
        contentType: file.type,
      });
    }

    // Create email content
    const emailContent = `
      <h2>New Bug Report Submitted</h2>

      <h3>Bug Type(s):</h3>
      <ul>
        ${bugType.map(type => `<li>${type}</li>`).join('')}
      </ul>

      <h3>Device Type:</h3>
      <p>${deviceType}</p>

      <h3>Bug Details:</h3>
      <p style="white-space: pre-wrap;">${bugDetails}</p>

      ${file ? `<h3>Attachment:</h3><p>File: ${file.name} (${file.size} bytes)</p>` : ''}

      <hr>
      <p><em>Submitted on: ${new Date().toLocaleString()}</em></p>
    `;

    // Send email
    const emailData = await resend.emails.send({
      from: 'Bug Reports <noreply@yourdomain.com>', // Replace with your verified domain
      to: [process.env.BUG_REPORT_EMAIL || 'your-email@gmail.com'], // Replace with your email
      subject: `Bug Report: ${bugType.join(', ')} - ${deviceType}`,
      html: emailContent,
      ...(attachments.length > 0 && { attachments }),
    });

    return NextResponse.json({
      success: true,
      message: 'Bug report submitted successfully',
      emailId: emailData.data?.id
    });

  } catch (error) {
    console.error('Error submitting bug report:', error);
    return NextResponse.json({
      error: 'Failed to submit bug report. Please try again.'
    }, {
      status: 500
    });
  }
}