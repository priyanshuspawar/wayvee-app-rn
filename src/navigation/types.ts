import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  // Public screens
  Onboard: undefined;
  Login: undefined;
  Register: undefined;
  Verify: { email: string };
  Profile: undefined;
  ApplyAgent: undefined;
  AgentPanel: undefined;
  CreateTrip: undefined;
  CreateAgentReachOutProfile: undefined;
  Bookings: undefined;

  // Authenticated screens
  CreateStay: undefined;
  Home: undefined;
  Stay: { stayId: string }; // Example param, adjust as needed
};

export type NavProp = NativeStackNavigationProp<RootStackParamList>;
