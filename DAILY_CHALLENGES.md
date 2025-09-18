# Daily Challenge System Implementation

## 🎯 Overview

This implementation creates a Wordle-style daily challenge system for Fact Five using your real challenge data from the `challenges/` directory. The system provides:

- **UTC-based global synchronization** - Same daily challenge for all users worldwide
- **Real challenge data** - Uses your production-ready challenges from `challenges/`
- **Deterministic rotation** - Consistent daily challenges with proper shuffling
- **90 days of content** - All your real challenges imported and scheduled

## 🚀 Quick Start

### 1. Import Real Challenges
```bash
npm run import-real-challenges
```
This will:
- Read all 90 challenge files from `challenges/`
- Transform them to MongoDB format
- Assign sequential dates starting from today
- Import to your database with proper indexes

### 2. Check Your Daily Challenge System
```bash
npm run challenge-rotation stats
```

### 3. Test Today's Challenge
Visit your API endpoint: `/api/daily-challenge`

## 📁 Files Added/Modified

### New Files
- `scripts/import-real-challenges.ts` - Import script for real challenges
- `scripts/challenge-rotation-manager.ts` - Management utilities
- `DAILY_CHALLENGES.md` - This documentation

### Modified Files
- `src/types/index.ts` - Added metadata field to Challenge interface
- `src/app/api/daily-challenge/route.ts` - Enhanced with UTC timing and fallbacks
- `package.json` - Added management scripts

## 🛠️ Management Commands

### Import & Setup
```bash
npm run import-real-challenges          # Import all real challenges
npm run challenge-rotation reassign     # Reassign dates (reshuffle)
```

### Monitoring & Stats
```bash
npm run challenge-rotation stats        # Show rotation statistics
npm run challenge-rotation upcoming 10  # Show next 10 challenges
npm run challenge-rotation validate     # Validate challenge data
```

### Testing
```bash
npm run challenge-rotation date 2024-12-25  # Check specific date
```

## 🌍 How Daily Timing Works

### UTC Synchronization
- **Reset Time**: 00:00 UTC (midnight UTC)
- **Global Consistency**: Same challenge for everyone, everywhere
- **Time Zones**:
  - New York: 7pm EST / 8pm EDT (previous day)
  - London: 12am GMT / 1am BST (same day)
  - Tokyo: 9am JST (same day)

### Challenge Selection
```typescript
const today = new Date().toISOString().split('T')[0]; // Always UTC!
const challenge = await db.collection('challenges').findOne({ date: today });
```

## 📊 Database Structure

### Challenge Document
```typescript
{
  challengeId: "athletes-phelps-2024-12-16",
  date: "2024-12-16",                    // YYYY-MM-DD (UTC)
  category: "ATHLETES",
  answer: { en: "Michael Phelps", es: "Michael Phelps" },
  facts: [
    {
      factType: "Personal Life",
      content: { en: "...", es: "..." }
    }
  ],
  alternatives: { en: [...], es: [...] },
  metadata: {
    imageUrl: "[Cloudinary URL]",
    citation: "JD Lasica, CC BY-SA 2.0",
    expanded: { ... },
    source: "real-challenges",
    importedAt: "2024-12-16T..."
  }
}
```

### Indexes Created
- `date` (unique) - Fast daily lookups
- `challengeId` (unique) - Data integrity
- `category` - Analytics and filtering

## 🔄 Challenge Rotation Logic

### Deterministic Shuffling
Challenges are shuffled consistently using challengeId as seed:
```typescript
const shuffledChallenges = challenges.sort((a, b) => {
  const aHash = a.challengeId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const bHash = b.challengeId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return aHash - bHash;
});
```

### Date Assignment
- Starts from import date (today)
- Sequential assignment after shuffle
- 90 days of unique content

## 🔒 Security & Performance

### API Security
- Rate limiting via existing middleware
- Answer excluded from API response
- Validation on all inputs
- Timeout protection

### Caching Strategy
- 5-minute cache on daily challenge fetch
- MongoDB connection pooling
- Database query timeouts

### Fallback Handling
- If no challenge for today → return earliest available
- Graceful degradation for missing data
- Comprehensive logging

## 🧪 Testing Your Implementation

### 1. Verify Import
```bash
npm run challenge-rotation stats
```
Should show:
- 90 total challenges
- Date range starting today
- Distribution across all categories

### 2. Test API
```bash
curl "http://localhost:3000/api/daily-challenge?lang=en"
```

### 3. Check Tomorrow's Challenge
```bash
npm run challenge-rotation upcoming 1
```

### 4. Validate Structure
```bash
npm run challenge-rotation validate
```

## 🎮 User Experience

### Frontend Changes Needed
Your frontend already handles the daily challenge API perfectly! The response format stays the same, but now:

- **Real data**: Rich, detailed challenges from your curated collection
- **Global sync**: All users get the same challenge each day
- **Consistent timing**: Challenge changes at UTC midnight

### What Users See
- Same high-quality challenges you've crafted
- Proper multi-language support (en/es)
- Rich facts and alternatives for Final Five
- Smooth daily progression

## 🔄 Future Maintenance

### Adding New Challenges
1. Add JSON files to `challenges/` directory
2. Run `npm run import-real-challenges` to reimport
3. Or manually add with proper date assignment

### Monitoring
- Check daily API logs for any issues
- Monitor challenge rotation stats weekly
- Validate data integrity monthly

### Scaling
- Current system handles 90 days (3 months)
- Can easily extend with more challenge files
- Database is optimized for much larger scale

## 🚨 Important Notes

### Data Integrity
- **Never modify `challenges/` during operation** - it's your source of truth
- The import script creates copies in MongoDB
- Original files remain untouched

### UTC Timing
- Your current API code already uses UTC correctly
- `new Date().toISOString().split('T')[0]` is UTC-based
- No timezone conversion needed

### Challenge Consistency
- Same challengeId hashing ensures reproducible shuffling
- Date reassignment maintains challenge variety
- Deterministic rotation prevents duplicates

---

## ✅ System Status

After running the import script, you'll have:
- ✅ 90 real challenges in database
- ✅ UTC-based daily timing
- ✅ Proper challenge rotation
- ✅ Fallback mechanisms
- ✅ Management tools
- ✅ Performance optimization

Your Fact Five game now has a production-ready daily challenge system! 🎉