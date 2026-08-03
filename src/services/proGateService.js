import { Alert } from 'react-native';

/**
 * Checks if the user is on the Pro tier.
 * If not, presents a prompt encouraging them to activate Library Pro.
 */
export const checkProAccess = (user, featureName, onApproved) => {
  if (user.tier === 'Library Pro' || user.tier === 'Pro') {
    onApproved();
    return true;
  }

  Alert.alert(
    "👑 Library Pro Required",
    `${featureName} is an exclusive Library Pro feature. Redeem an activation code in the Bazaar to unlock!`,
    [
      { text: "Later", style: "cancel" },
      { text: "Redeem Code", onPress: () => { /* Navigate to Bazaar / Redeem modal */ } }
    ]
  );
  return false;
};
