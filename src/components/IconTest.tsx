import React from 'react';
import { getFactIcon } from './FactBubble';
import Image from 'next/image';

export default function IconTest() {
  const factTypes = [
    'Official Language(s)',
    'Flag Colors & Features',
    'Notable City',
    'Largest Industry',
    'Population & Demographic Info',
    'Origin/Founding',
    'Geographic Features & Border Info'
  ];
  
  const iconNames = [
    'languages',
    'flag',
    'cityscape',
    'economy',
    'demographics',
    'history',
    'geography',
    'wildcard'
  ];
  
  return (
    <div className="p-8 bg-white">
      <h1 className="text-2xl font-bold mb-6">Icon Test</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Current Implementation (Gradient)</h2>
        <div className="grid grid-cols-4 gap-6">
          {factTypes.map((factType, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="bg-blue-50 p-4 rounded-full mb-2">
                {getFactIcon(factType, true, 48)}
              </div>
              <span className="text-sm text-center">{factType}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Original SVGs (Direct)</h2>
        <div className="grid grid-cols-4 gap-6">
          {iconNames.map((iconName, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="bg-blue-50 p-4 rounded-full mb-2">
                <div style={{ width: 48, height: 48 }}>
                  <Image 
                    src={`/icons/${iconName}.svg`}
                    width={48}
                    height={48}
                    alt={iconName}
                  />
                </div>
              </div>
              <span className="text-sm text-center">{iconName}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Alternative Approach (CSS Filter)</h2>
        <div className="grid grid-cols-4 gap-6">
          {iconNames.map((iconName, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="bg-blue-50 p-4 rounded-full mb-2">
                <div style={{ width: 48, height: 48 }}>
                  <Image 
                    src={`/icons/${iconName}.svg`}
                    width={48}
                    height={48}
                    alt={iconName}
                    className="icon-blue-gradient"
                    style={{ 
                      filter: 'brightness(0) saturate(100%) invert(43%) sepia(97%) saturate(1752%) hue-rotate(210deg) brightness(101%) contrast(101%)'
                    }}
                  />
                </div>
              </div>
              <span className="text-sm text-center">{iconName}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 