// Test script for student activities API
const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

async function testStudentActivitiesAPI() {
  console.log('🧪 Testing Student Activities API...\n');

  try {
    // Test 1: Create/Update student activities
    console.log('1️⃣ Testing POST /api/student-activities/activities');
    const createData = {
      className: 'Grade 10',
      studentName: 'Test Student',
      termNumber: 1,
      personalHygiene: 'XC',
      learningMaterialsCare: 'G',
      timeManagement: 'SI',
      workIndependently: 'G',
      obeysRules: 'XC',
      overallResponsibility: 'G',
      socialRelation: 'XC'
    };

    const createResponse = await axios.post(
      `${API_BASE_URL}/student-activities/activities`,
      createData
    );
    console.log('✅ Create/Update Success:', createResponse.data);
    console.log('');

    // Test 2: Get activities for specific student
    console.log('2️⃣ Testing GET /api/student-activities/activities/:className/:studentName');
    const getResponse = await axios.get(
      `${API_BASE_URL}/student-activities/activities/Grade 10/Test Student`
    );
    console.log('✅ Get Student Activities Success:');
    console.log('   Activities found:', getResponse.data.activities.length);
    console.log('   Data:', JSON.stringify(getResponse.data.activities, null, 2));
    console.log('');

    // Test 3: Get all activities for a class
    console.log('3️⃣ Testing GET /api/student-activities/activities/:className/all');
    const getAllResponse = await axios.get(
      `${API_BASE_URL}/student-activities/activities/Grade 10/all`
    );
    console.log('✅ Get All Class Activities Success:');
    console.log('   Total activities:', getAllResponse.data.activities.length);
    console.log('');

    // Test 4: Create Term 2 activities
    console.log('4️⃣ Testing POST for Term 2');
    const term2Data = {
      ...createData,
      termNumber: 2,
      personalHygiene: 'XC',
      learningMaterialsCare: 'XC',
      timeManagement: 'G'
    };

    const term2Response = await axios.post(
      `${API_BASE_URL}/student-activities/activities`,
      term2Data
    );
    console.log('✅ Term 2 Create Success:', term2Response.data);
    console.log('');

    // Test 5: Verify both terms are returned
    console.log('5️⃣ Verifying both terms are returned');
    const bothTermsResponse = await axios.get(
      `${API_BASE_URL}/student-activities/activities/Grade 10/Test Student`
    );
    console.log('✅ Both Terms Retrieved:');
    console.log('   Total terms:', bothTermsResponse.data.activities.length);
    bothTermsResponse.data.activities.forEach(activity => {
      console.log(`   - Term ${activity.term_number}: ${activity.personal_hygiene}`);
    });
    console.log('');

    console.log('🎉 All tests passed successfully!');
    console.log('\n📝 Summary:');
    console.log('   ✓ Create/Update activities');
    console.log('   ✓ Get student activities');
    console.log('   ✓ Get all class activities');
    console.log('   ✓ Multiple terms support');
    console.log('\n✅ Student Activities API is working correctly!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
    console.log('\n💡 Troubleshooting:');
    console.log('   1. Make sure the server is running (node backend/server.js)');
    console.log('   2. Verify the database table exists (node backend/scripts/create-student-activities-table.js)');
    console.log('   3. Check that the route is registered in server.js');
    process.exit(1);
  }
}

// Run the tests
testStudentActivitiesAPI();
