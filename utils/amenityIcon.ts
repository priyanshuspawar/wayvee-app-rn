// src/components/AmenityIcons.ts
import Air_conditioning from '@Assets/amenities/Air_conditioning.svg';
import BBQ_grill from '@Assets/amenities/BBQ_grill.svg';
import Beach_area from '@Assets/amenities/Beach_area.svg';
import Fire_extinguisher from '@Assets/amenities/Fire_extinguisher.svg';
import Fireplace from '@Assets/amenities/Fireplace.svg';
import First_aid_kit from '@Assets/amenities/First_aid_kit.svg';
import Gym from '@Assets/amenities/Gym.svg';
import Hot_tub from '@Assets/amenities/Hot_tub.svg';
import Kitchen from '@Assets/amenities/Kitchen.svg';
import Lake_area from '@Assets/amenities/Lake_area.svg';
import Outdoor_dining from '@Assets/amenities/Outdoor_dining.svg';
import Paid_parking from '@Assets/amenities/Paid_parking.svg';
import Parking from '@Assets/amenities/Parking.svg';
import Patio from '@Assets/amenities/Patio.svg';
import Piano from '@Assets/amenities/Piano.svg';
import Pool from '@Assets/amenities/Pool.svg';
import Pool_table from '@Assets/amenities/Pool_table.svg';
import Shower from '@Assets/amenities/Shower.svg';
import Ski from '@Assets/amenities/Ski.svg';
import Smoke_alarm from '@Assets/amenities/Smoke_alarm.svg';
import TV from '@Assets/amenities/TV.svg';
import Washing_machine from '@Assets/amenities/Washing_machine.svg';
import Wifi from '@Assets/amenities/Wifi.svg';
import Workspace from '@Assets/amenities/Workspace.svg';
import { SvgProps } from 'react-native-svg';

export type AmenityIcons =
  | 'AirCondition'
  | 'BbqGrill'
  | 'BeachArea'
  | 'FireExtinguisher'
  | 'FirePlace'
  | 'FirstAidKit'
  | 'Gym'
  | 'HotTub'
  | 'Kitchen'
  | 'LakeArea'
  | 'OutdoorDining'
  | 'PaidParking'
  | 'Parking'
  | 'Patio'
  | 'Piano'
  | 'PoolTable'
  | 'Pool'
  | 'Shower'
  | 'Ski'
  | 'SmokeAlarm'
  | 'TV'
  | 'WashingMachine'
  | 'Wifi'
  | 'Workspace';

const AmenityIconMap: Record<string, React.FC<SvgProps>> = {
  AirCondition: Air_conditioning,
  BbqGrill: BBQ_grill,
  BeachArea: Beach_area,
  FireExtinguisher: Fire_extinguisher,
  FirePlace: Fireplace,
  FirstAidKit: First_aid_kit,
  Gym,
  HotTub: Hot_tub,
  Kitchen,
  LakeArea: Lake_area,
  OutdoorDining: Outdoor_dining,
  PaidParking: Paid_parking,
  Parking,
  Patio,
  Piano,
  PoolTable: Pool_table,
  Pool,
  Shower,
  Ski,
  SmokeAlarm: Smoke_alarm,
  TV,
  WashingMachine: Washing_machine,
  Wifi,
  Workspace,
};

export default AmenityIconMap;
