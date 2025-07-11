// Test utilities for validating app functionality

interface TestResult {
  passed: boolean;
  message: string;
  details?: any;
}

// Test probability distribution accuracy
export const testProbabilityDistribution = (): TestResult => {
  try {
    const segments = [
      { id: 1, probability: 25 },
      { id: 2, probability: 20 },
      { id: 3, probability: 15 },
      { id: 4, probability: 5 },
      { id: 5, probability: 15 },
      { id: 6, probability: 15 },
      { id: 7, probability: 3 },
      { id: 8, probability: 2 },
    ];

    const totalProbability = segments.reduce((sum, seg) => sum + seg.probability, 0);
    
    if (totalProbability !== 100) {
      return {
        passed: false,
        message: "Probability distribution does not sum to 100",
        details: { total: totalProbability, segments }
      };
    }

    return {
      passed: true,
      message: "Probability distribution is valid",
      details: { segments }
    };
  } catch (error) {
    return {
      passed: false,
      message: "Error testing probability distribution",
      details: error
    };
  }
};

// Test localStorage functionality
export const testLocalStorageIntegrity = (): TestResult => {
  try {
    // Test if localStorage is available
    if (typeof Storage === "undefined") {
      return {
        passed: false,
        message: "localStorage is not supported",
      };
    }

    // Test write/read
    const testKey = "spinnerAppTest";
    const testValue = { test: true, timestamp: Date.now() };
    
    localStorage.setItem(testKey, JSON.stringify(testValue));
    const retrieved = JSON.parse(localStorage.getItem(testKey) || "{}");
    localStorage.removeItem(testKey);

    if (retrieved.test !== testValue.test) {
      return {
        passed: false,
        message: "localStorage read/write test failed",
      };
    }

    return {
      passed: true,
      message: "localStorage is working correctly",
    };
  } catch (error) {
    return {
      passed: false,
      message: "localStorage functionality error",
      details: error
    };
  }
};

// Test user session validation
export const testUserSession = (userData: any): TestResult => {
  try {
    if (!userData) {
      return {
        passed: false,
        message: "No user data provided",
      };
    }

    if (!userData.name || typeof userData.name !== "string" || userData.name.trim().length === 0) {
      return {
        passed: false,
        message: "Invalid user name",
        details: userData.name
      };
    }

    if (!userData.mobile || typeof userData.mobile !== "string" || userData.mobile.length < 10) {
      return {
        passed: false,
        message: "Invalid mobile number",
        details: userData.mobile
      };
    }

    return {
      passed: true,
      message: "User session is valid",
      details: { name: userData.name, mobileLength: userData.mobile.length }
    };
  } catch (error) {
    return {
      passed: false,
      message: "Error validating user session",
      details: error
    };
  }
};

// Test mobile responsiveness (viewport)
export const testMobileResponsiveness = (): TestResult => {
  try {
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
      isMobile: window.innerWidth <= 768,
      isTablet: window.innerWidth > 768 && window.innerWidth <= 1024,
      isDesktop: window.innerWidth > 1024,
    };

    return {
      passed: true,
      message: "Viewport information collected",
      details: viewport
    };
  } catch (error) {
    return {
      passed: false,
      message: "Error testing mobile responsiveness",
      details: error
    };
  }
};

// Run all tests
export const runAllTests = () => {
  console.group("🧪 Running App Tests");
  
  const tests = [
    { name: "Probability Distribution", test: testProbabilityDistribution },
    { name: "LocalStorage Integrity", test: testLocalStorageIntegrity },
    { name: "Mobile Responsiveness", test: testMobileResponsiveness },
  ];

  const results = tests.map(({ name, test }) => {
    const result = test();
    console.log(`${result.passed ? "✅" : "❌"} ${name}: ${result.message}`);
    if (result.details && !result.passed) {
      console.error("Details:", result.details);
    }
    return { name, ...result };
  });

  // Test current user session if available
  try {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
    if (currentUser) {
      const userTest = testUserSession(currentUser);
      console.log(`${userTest.passed ? "✅" : "❌"} User Session: ${userTest.message}`);
      results.push({ name: "User Session", ...userTest });
    }
  } catch (error) {
    console.error("❌ User Session: Error testing current user");
  }

  console.groupEnd();
  return results;
};