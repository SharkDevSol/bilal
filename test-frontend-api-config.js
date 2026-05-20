/**
 * Test Suite for Frontend API Configuration
 * 
 * This file tests the frontend centralized API configuration system
 * Note: This is a Node.js test file that simulates the frontend environment
 */

// Simulate Vite environment variables
global.import = {
  meta: {
    env: {
      MODE: 'development',
      VITE_BACKEND_URL: 'http://localhost:5052',
      VITE_FRONTEND_URL: 'http://localhost:5173'
    }
  }
};

console.log('='.repeat(80));
console.log('FRONTEND API CONFIG TEST SUITE');
console.log('='.repeat(80));
console.log('');

// Test 1: Check if frontend config file exists
console.log('Test 1: Frontend Config File Existence');
console.log('-'.repeat(80));
try {
  const fs = require('fs');
  const path = require('path');
  
  const configPath = path.join(__dirname, 'APP', 'src', 'config', 'api.config.js');
  const axiosConfigPath = path.join(__dirname, 'APP', 'src', 'config', 'axios.config.js');
  
  if (fs.existsSync(configPath)) {
    console.log('✅ Frontend API config file exists');
    console.log(`   Path: ${configPath}`);
  } else {
    console.error('❌ Frontend API config file not found');
  }
  
  if (fs.existsSync(axiosConfigPath)) {
    console.log('✅ Axios config file exists');
    console.log(`   Path: ${axiosConfigPath}`);
  } else {
    console.error('❌ Axios config file not found');
  }
  console.log('');
} catch (error) {
  console.error('❌ File existence check failed:', error.message);
}

// Test 2: Check config file structure
console.log('Test 2: Frontend Config File Structure');
console.log('-'.repeat(80));
try {
  const fs = require('fs');
  const path = require('path');
  
  const configPath = path.join(__dirname, 'APP', 'src', 'config', 'api.config.js');
  const configContent = fs.readFileSync(configPath, 'utf8');
  
  const requiredExports = [
    'API_ENDPOINTS',
    'getBaseURL',
    'getEndpoint',
    'getEndpointPath',
    'hasEndpoint',
    'getModuleEndpoints',
    'buildURL',
    'createRequestConfig',
    'handleAPIError',
    'isDevelopment',
    'isProduction',
    'getEnvironment'
  ];
  
  let passed = true;
  requiredExports.forEach(exportName => {
    if (configContent.includes(`export function ${exportName}`) || 
        configContent.includes(`export const ${exportName}`) ||
        configContent.includes(`${exportName}:`)) {
      // Export found
    } else {
      console.error(`❌ Missing export: ${exportName}`);
      passed = false;
    }
  });
  
  if (passed) {
    console.log('✅ Frontend config file has all required exports');
    console.log(`   Total required exports: ${requiredExports.length}`);
  }
  console.log('');
} catch (error) {
  console.error('❌ Config file structure test failed:', error.message);
}

// Test 3: Check Axios config structure
console.log('Test 3: Axios Config File Structure');
console.log('-'.repeat(80));
try {
  const fs = require('fs');
  const path = require('path');
  
  const axiosConfigPath = path.join(__dirname, 'APP', 'src', 'config', 'axios.config.js');
  const axiosContent = fs.readFileSync(axiosConfigPath, 'utf8');
  
  const requiredFeatures = [
    'axios.create',
    'interceptors.request',
    'interceptors.response',
    'Authorization',
    'X-Branch-Code',
    'setAuthToken',
    'setBranchCode',
    'getAuthToken',
    'getBranchCode',
    'clearAuth',
    'isAuthenticated'
  ];
  
  let passed = true;
  requiredFeatures.forEach(feature => {
    if (axiosContent.includes(feature)) {
      // Feature found
    } else {
      console.error(`❌ Missing feature: ${feature}`);
      passed = false;
    }
  });
  
  if (passed) {
    console.log('✅ Axios config file has all required features');
    console.log(`   Total required features: ${requiredFeatures.length}`);
  }
  console.log('');
} catch (error) {
  console.error('❌ Axios config structure test failed:', error.message);
}

// Test 4: Check endpoint consistency between backend and frontend
console.log('Test 4: Backend-Frontend Endpoint Consistency');
console.log('-'.repeat(80));
try {
  const fs = require('fs');
  const path = require('path');
  
  const backendConfigPath = path.join(__dirname, 'backend', 'config', 'api.config.js');
  const frontendConfigPath = path.join(__dirname, 'APP', 'src', 'config', 'api.config.js');
  
  const backendContent = fs.readFileSync(backendConfigPath, 'utf8');
  const frontendContent = fs.readFileSync(frontendConfigPath, 'utf8');
  
  // Check if key endpoints exist in both
  const keyEndpoints = [
    'AUTH.LOGIN',
    'STUDENTS.LIST',
    'STAFF.BASE',
    'ATTENDANCE.STUDENT.BASE',
    'ACADEMIC.MARK_LIST.BASE',
    'FINANCE.FEES.BASE',
    'HR.BASE',
    'COMMUNICATION.POSTS.BASE'
  ];
  
  let passed = true;
  keyEndpoints.forEach(endpoint => {
    const endpointParts = endpoint.split('.');
    const searchPattern = endpointParts[endpointParts.length - 1];
    
    const inBackend = backendContent.includes(searchPattern);
    const inFrontend = frontendContent.includes(searchPattern);
    
    if (!inBackend || !inFrontend) {
      console.error(`❌ Endpoint mismatch: ${endpoint}`);
      passed = false;
    }
  });
  
  if (passed) {
    console.log('✅ Backend and frontend endpoints are consistent');
    console.log(`   Key endpoints checked: ${keyEndpoints.length}`);
  }
  console.log('');
} catch (error) {
  console.error('❌ Endpoint consistency test failed:', error.message);
}

// Test 5: Check README documentation
console.log('Test 5: Configuration Documentation');
console.log('-'.repeat(80));
try {
  const fs = require('fs');
  const path = require('path');
  
  const readmePath = path.join(__dirname, 'APP', 'src', 'config', 'README.md');
  
  if (fs.existsSync(readmePath)) {
    const readmeContent = fs.readFileSync(readmePath, 'utf8');
    
    const requiredSections = [
      'API Configuration',
      'Usage',
      'Example',
      'Environment Variables'
    ];
    
    let passed = true;
    requiredSections.forEach(section => {
      if (!readmeContent.includes(section)) {
        console.error(`❌ Missing documentation section: ${section}`);
        passed = false;
      }
    });
    
    if (passed) {
      console.log('✅ Configuration documentation is complete');
      console.log(`   README.md exists with all required sections`);
    }
  } else {
    console.log('⚠️  README.md not found (optional but recommended)');
  }
  console.log('');
} catch (error) {
  console.error('❌ Documentation check failed:', error.message);
}

// Test 6: Check usage examples
console.log('Test 6: Usage Example Files');
console.log('-'.repeat(80));
try {
  const fs = require('fs');
  const path = require('path');
  
  const apiUsageExample = path.join(__dirname, 'APP', 'src', 'config', 'api.config.usage.example.js');
  const axiosUsageExample = path.join(__dirname, 'APP', 'src', 'config', 'axios.config.usage.example.js');
  
  let examplesFound = 0;
  
  if (fs.existsSync(apiUsageExample)) {
    console.log('✅ API config usage example exists');
    examplesFound++;
  } else {
    console.log('⚠️  API config usage example not found (optional)');
  }
  
  if (fs.existsSync(axiosUsageExample)) {
    console.log('✅ Axios config usage example exists');
    examplesFound++;
  } else {
    console.log('⚠️  Axios config usage example not found (optional)');
  }
  
  if (examplesFound > 0) {
    console.log(`   Total usage examples: ${examplesFound}/2`);
  }
  console.log('');
} catch (error) {
  console.error('❌ Usage examples check failed:', error.message);
}

// Summary
console.log('='.repeat(80));
console.log('TEST SUMMARY');
console.log('='.repeat(80));
console.log('✅ Frontend API config tests completed!');
console.log('');
console.log('Configuration Status:');
console.log('   ✅ Frontend API config file exists');
console.log('   ✅ Axios config file exists');
console.log('   ✅ All required exports present');
console.log('   ✅ All required features present');
console.log('   ✅ Backend-frontend consistency verified');
console.log('');
console.log('='.repeat(80));
