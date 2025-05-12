import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  // Public screens
  Onboard: undefined;
  Login: undefined;
  Register: undefined;
  Verify: { email: string };
  Profile: undefined;
  ApplyAgent: undefined;
  VerifyAccount: undefined;
  AgentPanel: undefined;
  CreateTrip: undefined;
  CreateAgentReachOutProfile: undefined;
  Bookings: undefined;
  UserMessageScreen: { agentId: string };

  // Authenticated screens
  CreateStay: undefined;
  Home: undefined;
  Stay: { stay: any }; // Example param, adjust as needed
};

export type NavProp = NativeStackNavigationProp<RootStackParamList>;
