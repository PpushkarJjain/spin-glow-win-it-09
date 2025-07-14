import { supabase } from "@/integrations/supabase/client";
import { selectRandomOffer, recordSpin } from "@/services/spinService";
import { resetAllCounters } from "@/services/adminService";
import { getSystemState } from "@/services/systemService";

const TEST_USER_ID = "a1b2c3d4-e5f6-7890-1234-56789abcdef0"; // A dummy user ID for testing

async function ensureTestUserExists() {
  const { data, error } = await supabase
    .from('users')
    .select('id')
    .eq('id', TEST_USER_ID)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to check for test user: ${error.message}`);
  }

  if (!data) {
    console.log("Test user not found, creating it...");
    const { error: insertError } = await supabase
      .from('users')
      .insert({ 
        id: TEST_USER_ID, 
        name: 'Test User', 
        mobile: '0000000000' 
      });

    if (insertError) {
      throw new Error(`Failed to create test user: ${insertError.message}`);
    }
    console.log("Test user created successfully.");
  }
}

async function runValidationTest() {
  console.log("Starting backend validation test...");

  // 0. Ensure test user exists
  console.log("Step 0: Ensuring test user exists...");
  await ensureTestUserExists();

  // 1. Reset all counters to ensure a clean state
  console.log("Step 1: Resetting all counters...");
  await resetAllCounters();
  console.log("Counters reset successfully.");

  // 2. Simulate 200 spins
  console.log("\nStep 2: Simulating 200 spins...");
  for (let i = 1; i <= 200; i++) {
    const systemState = await getSystemState();
    console.log(`\n--- Spin ${i} (Round ${systemState.current_round}, Spin in Round ${systemState.spins_in_current_round}) ---`);

    try {
      // Select an offer
      const selectedOffer = await selectRandomOffer();
      console.log(`Selected Offer: ${selectedOffer.label} (ID: ${selectedOffer.id})`);

      // Record the spin
      await recordSpin(TEST_USER_ID, selectedOffer);
      console.log("Spin recorded successfully.");

      // Verify the database state
      const { data: segmentData, error } = await supabase
        .from('offer_segments')
        .select('current_count, max_per_round')
        .eq('round_number', parseInt(systemState.current_round))
        .eq('segment_number', selectedOffer.id)
        .single();

      if (error) {
        throw new Error(`DB Verification Failed: Could not fetch segment data. ${error.message}`);
      }

      if (segmentData.current_count > segmentData.max_per_round) {
        throw new Error(`Validation Failed: Offer "${selectedOffer.label}" was selected even though its count (${segmentData.current_count}) exceeded its max limit (${segmentData.max_per_round}).`);
      }

      console.log(`DB Verification Passed: Count for "${selectedOffer.label}" is ${segmentData.current_count}/${segmentData.max_per_round}.`);

    } catch (error) {
      console.error("Test failed during spin simulation:", error);
      return;
    }
  }

  // 3. Final verification
  console.log("\nStep 3: Final Verification...");
  const finalState = await getSystemState();
  if (finalState.current_round === '2' && finalState.spins_in_current_round === '0') {
    console.log("✅ Test Passed: System correctly rolled over to Round 2 and reset spin count.");
  } else {
    console.error(`❌ Test Failed: Final state is incorrect. Round: ${finalState.current_round}, Spins in Round: ${finalState.spins_in_current_round}`);
    return;
  }

  console.log("\nBackend validation test completed successfully!");
}

// To run this test, you would typically use a test runner like Vitest or Jest,
// or execute it directly via a script command.
// For now, we can add a way to trigger it from the browser or a command.
runValidationTest();
