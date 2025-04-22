export type RootStackParamList = {
  // Public screens
  Onboard: undefined;
  Login: undefined;
  Register: undefined;

  // Authenticated screens
  Home: undefined;
  Stay: { stayId: string }; // Example param, adjust as needed
};
