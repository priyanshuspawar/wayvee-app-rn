// src/components/PlaceIcons.ts

import Apartment from '@Assets/places/Apartment.svg';
import Barn from '@Assets/places/Barn.svg';
import BedBreakfast from '@Assets/places/Bed&breakfast.svg';
import Cabin from '@Assets/places/Cabin.svg';
import Campervan from '@Assets/places/Campervan.svg';
import CasaParticular from '@Assets/places/CasaParticular.svg';
import Castle from '@Assets/places/Castle.svg';
import Cave from '@Assets/places/Cave.svg';
import Container from '@Assets/places/Container.svg';
import CycladicHome from '@Assets/places/CycladicHome.svg';
import Dammuso from '@Assets/places/Dammuso.svg';
import Dome from '@Assets/places/Dome.svg';
import Farm from '@Assets/places/Farm.svg';
import GuestHouse from '@Assets/places/GuestHouse.svg';
import Hotel from '@Assets/places/Hotel.svg';
import House from '@Assets/places/House.svg';
import Houseboat from '@Assets/places/Houseboat.svg';
import Kezhan from '@Assets/places/Kezhan.svg';
import Minsu from '@Assets/places/Minsu.svg';
import Raid from '@Assets/places/Raid.svg';
import Ryokan from '@Assets/places/Ryokan.svg';
import ShepherdsHut from '@Assets/places/ShephersHut.svg';
import Tent from '@Assets/places/Tent.svg';
import TinyHome from '@Assets/places/Tiny_home.svg';
import Tower from '@Assets/places/Tower.svg';
import TreeHouse from '@Assets/places/Tree_house.svg';
import Trullo from '@Assets/places/Trullo.svg';
import Windmill from '@Assets/places/Windmill.svg';
import Yurt from '@Assets/places/Yurt.svg';
import { SvgProps } from 'react-native-svg';

export type PlaceIcons =
  | 'Apartment'
  | 'Barn'
  | 'BedBreakfast'
  | 'Cabin'
  | 'Campervan'
  | 'CasaParticular'
  | 'Castle'
  | 'Cave'
  | 'Container'
  | 'CycladicHome'
  | 'Dammuso'
  | 'Dome'
  | 'Farm'
  | 'GuestHouse'
  | 'Hotel'
  | 'House'
  | 'Houseboat'
  | 'Kezhan'
  | 'Minsu'
  | 'Raid'
  | 'Ryokan'
  | 'ShepherdsHut'
  | 'Tent'
  | 'TinyHome'
  | 'Tower'
  | 'TreeHouse'
  | 'Trullo'
  | 'Windmill'
  | 'Yurt';

const PlaceIconMap: Record<PlaceIcons, React.FC<SvgProps>> = {
  Apartment,
  Barn,
  BedBreakfast,
  Cabin,
  Campervan,
  CasaParticular,
  Castle,
  Cave,
  Container,
  CycladicHome,
  Dammuso,
  Dome,
  Farm,
  GuestHouse,
  Hotel,
  House,
  Houseboat,
  Kezhan,
  Minsu,
  Raid,
  Ryokan,
  ShepherdsHut,
  Tent,
  TinyHome,
  Tower,
  TreeHouse,
  Trullo,
  Windmill,
  Yurt,
};

export default PlaceIconMap;
