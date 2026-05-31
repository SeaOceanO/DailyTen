import { StyleSheet, Text, View } from 'react-native';
import type { ViewStyle } from 'react-native';

import type { NewsCoverVisual } from '../data/mockNews';

type ShapeProps = {
  border?: boolean;
  color: string;
  opacity?: number;
  style: ViewStyle;
};

export function CoverVisual({ visual }: { visual: NewsCoverVisual }) {
  return (
    <View style={[styles.cover, { backgroundColor: visual.backgroundColor }]}>
      <Shape color={visual.secondaryColor} opacity={0.28} style={styles.backOrbLarge} />
      <Shape color={visual.accentColor} opacity={0.16} style={styles.backOrbSmall} />
      <Shape color={visual.secondaryColor} opacity={0.2} style={styles.diagonalWash} />
      <TopicScene visual={visual} />
      <View style={styles.labelPanel}>
        <Text style={styles.kicker}>DAILY TEN</Text>
        <Text style={[styles.label, { color: visual.accentColor }]}>{visual.label}</Text>
      </View>
    </View>
  );
}

function TopicScene({ visual }: { visual: NewsCoverVisual }) {
  const accent = visual.accentColor;
  const secondary = visual.secondaryColor;

  switch (visual.pattern) {
    case 'routes':
      return (
        <View style={styles.scene}>
          <Shape color={secondary} opacity={0.75} style={styles.road} />
          <Shape color={accent} opacity={0.8} style={styles.routeBuildingOne} />
          <Shape color={accent} opacity={0.6} style={styles.routeBuildingTwo} />
          <Shape color={accent} opacity={0.45} style={styles.routeBuildingThree} />
          <Shape color="#ffffff" opacity={0.75} style={styles.laneOne} />
          <Shape color="#ffffff" opacity={0.75} style={styles.laneTwo} />
          <Shape color={accent} style={styles.carOne} />
          <Shape color={secondary} style={styles.carTwo} />
          <Shape color="#ffffff" opacity={0.8} style={styles.carWindowOne} />
          <Shape color="#ffffff" opacity={0.8} style={styles.carWindowTwo} />
        </View>
      );
    case 'care':
      return (
        <View style={styles.scene}>
          <Shape color={secondary} opacity={0.82} style={styles.careBuilding} />
          <Shape color={accent} opacity={0.78} style={styles.careRoof} />
          <Shape color="#ffffff" opacity={0.7} style={styles.careWindowOne} />
          <Shape color="#ffffff" opacity={0.7} style={styles.careWindowTwo} />
          <Shape color={accent} style={styles.personHeadOne} />
          <Shape color={accent} opacity={0.76} style={styles.personBodyOne} />
          <Shape color={secondary} style={styles.personHeadTwo} />
          <Shape color={secondary} opacity={0.82} style={styles.personBodyTwo} />
        </View>
      );
    case 'charge':
      return (
        <View style={styles.scene}>
          <Shape color={secondary} opacity={0.75} style={styles.evCarBody} />
          <Shape color={accent} opacity={0.85} style={styles.evCarTop} />
          <Shape color="#ffffff" opacity={0.75} style={styles.evWindow} />
          <Shape color={accent} style={styles.chargeStation} />
          <Shape color={secondary} opacity={0.75} style={styles.chargeCable} />
          <Shape color="#ffffff" opacity={0.9} style={styles.evWheelOne} />
          <Shape color="#ffffff" opacity={0.9} style={styles.evWheelTwo} />
          <Text style={[styles.sceneTinyText, styles.evText]}>EV</Text>
        </View>
      );
    case 'travel':
      return (
        <View style={styles.scene}>
          <Shape color={accent} opacity={0.88} style={styles.sun} />
          <Shape color={secondary} opacity={0.7} style={styles.mountainOne} />
          <Shape color={accent} opacity={0.52} style={styles.mountainTwo} />
          <Shape color="#ffffff" opacity={0.58} style={styles.waveA} />
          <Shape color="#ffffff" opacity={0.42} style={styles.waveB} />
        </View>
      );
    case 'weather':
      return (
        <View style={styles.scene}>
          <Shape color={accent} opacity={0.86} style={styles.cloudOne} />
          <Shape color={accent} opacity={0.72} style={styles.cloudTwo} />
          <Shape color={secondary} opacity={0.75} style={styles.rainOne} />
          <Shape color={secondary} opacity={0.75} style={styles.rainTwo} />
          <Shape color={secondary} opacity={0.75} style={styles.rainThree} />
          <Shape color="#ffffff" opacity={0.42} style={styles.floodLineOne} />
          <Shape color="#ffffff" opacity={0.36} style={styles.floodLineTwo} />
        </View>
      );
    case 'school':
      return (
        <View style={styles.scene}>
          <Shape color={accent} opacity={0.82} style={styles.schoolRoof} />
          <Shape color={secondary} opacity={0.82} style={styles.schoolMain} />
          <Shape color="#ffffff" opacity={0.7} style={styles.schoolDoor} />
          <Shape color="#ffffff" opacity={0.65} style={styles.crosswalkOne} />
          <Shape color="#ffffff" opacity={0.65} style={styles.crosswalkTwo} />
          <Shape color="#ffffff" opacity={0.65} style={styles.crosswalkThree} />
          <Shape color={accent} style={styles.schoolBus} />
        </View>
      );
    case 'culture':
      return (
        <View style={styles.scene}>
          <Shape color={secondary} opacity={0.76} style={styles.bookShelf} />
          <Shape color={accent} opacity={0.86} style={styles.bookOne} />
          <Shape color={accent} opacity={0.68} style={styles.bookTwo} />
          <Shape color="#ffffff" opacity={0.58} style={styles.bookThree} />
          <Shape color={secondary} style={styles.readingLamp} />
          <Shape color={accent} opacity={0.7} style={styles.lampGlow} />
        </View>
      );
    case 'health':
      return (
        <View style={styles.scene}>
          <Shape color={secondary} opacity={0.76} style={styles.healthCard} />
          <Shape color={accent} style={styles.pulseOne} />
          <Shape color={accent} style={styles.pulseTwo} />
          <Shape color={accent} style={styles.pulseThree} />
          <Shape color="#ffffff" opacity={0.65} style={styles.pillOne} />
          <Shape color="#ffffff" opacity={0.65} style={styles.pillTwo} />
        </View>
      );
    case 'business':
      return (
        <View style={styles.scene}>
          <Shape color={secondary} opacity={0.78} style={styles.shopBody} />
          <Shape color={accent} opacity={0.86} style={styles.shopAwning} />
          <Shape color="#ffffff" opacity={0.65} style={styles.shopDoor} />
          <Shape color={accent} style={styles.posScreen} />
          <Shape color="#ffffff" opacity={0.7} style={styles.chartOne} />
          <Shape color="#ffffff" opacity={0.7} style={styles.chartTwo} />
          <Shape color="#ffffff" opacity={0.7} style={styles.chartThree} />
        </View>
      );
    case 'green':
      return (
        <View style={styles.scene}>
          <Shape color={secondary} opacity={0.76} style={styles.officeTower} />
          <Shape color="#ffffff" opacity={0.5} style={styles.officeWindowOne} />
          <Shape color="#ffffff" opacity={0.5} style={styles.officeWindowTwo} />
          <Shape color="#ffffff" opacity={0.5} style={styles.officeWindowThree} />
          <Shape color={accent} opacity={0.88} style={styles.leafOne} />
          <Shape color={accent} opacity={0.7} style={styles.leafTwo} />
        </View>
      );
    case 'energy':
      return (
        <View style={styles.scene}>
          <Shape color={secondary} opacity={0.82} style={styles.energyTankOne} />
          <Shape color={secondary} opacity={0.62} style={styles.energyTankTwo} />
          <Shape color={accent} opacity={0.86} style={styles.powerPole} />
          <Shape color={accent} opacity={0.7} style={styles.powerLineOne} />
          <Shape color={accent} opacity={0.7} style={styles.powerLineTwo} />
        </View>
      );
    case 'payments':
      return (
        <View style={styles.scene}>
          <Shape color={secondary} opacity={0.78} style={styles.paymentPhone} />
          <Shape color={accent} opacity={0.88} style={styles.paymentCard} />
          <Shape color="#ffffff" opacity={0.7} style={styles.paymentLineOne} />
          <Shape color="#ffffff" opacity={0.7} style={styles.paymentLineTwo} />
          <Text style={[styles.sceneTinyText, styles.payText]}>PAY</Text>
        </View>
      );
    case 'port':
      return (
        <View style={styles.scene}>
          <Shape color={accent} opacity={0.9} style={styles.cranePole} />
          <Shape color={accent} opacity={0.72} style={styles.craneArm} />
          <Shape color={secondary} opacity={0.8} style={styles.containerOne} />
          <Shape color={accent} opacity={0.75} style={styles.containerTwo} />
          <Shape color={secondary} opacity={0.7} style={styles.shipHull} />
          <Shape color="#ffffff" opacity={0.38} style={styles.portWater} />
        </View>
      );
    case 'solar':
      return (
        <View style={styles.scene}>
          <Shape color={accent} opacity={0.86} style={styles.solarSun} />
          <Shape color={secondary} opacity={0.8} style={styles.solarPanelOne} />
          <Shape color={secondary} opacity={0.62} style={styles.solarPanelTwo} />
          <Shape color="#ffffff" opacity={0.48} style={styles.solarGridOne} />
          <Shape color="#ffffff" opacity={0.48} style={styles.solarGridTwo} />
        </View>
      );
    case 'agri':
      return (
        <View style={styles.scene}>
          <Shape color={accent} opacity={0.72} style={styles.fieldOne} />
          <Shape color={secondary} opacity={0.64} style={styles.fieldTwo} />
          <Shape color={accent} opacity={0.52} style={styles.fieldThree} />
          <Shape color="#ffffff" opacity={0.58} style={styles.cropStemOne} />
          <Shape color="#ffffff" opacity={0.58} style={styles.cropStemTwo} />
          <Shape color="#ffffff" opacity={0.58} style={styles.cropStemThree} />
        </View>
      );
    case 'aviation':
      return (
        <View style={styles.scene}>
          <Shape color={secondary} opacity={0.46} style={styles.runway} />
          <Shape color={accent} opacity={0.9} style={styles.planeBody} />
          <Shape color={accent} opacity={0.82} style={styles.planeWing} />
          <Shape color="#ffffff" opacity={0.58} style={styles.planeTrailOne} />
          <Shape color="#ffffff" opacity={0.42} style={styles.planeTrailTwo} />
        </View>
      );
    case 'robotics':
      return (
        <View style={styles.scene}>
          <Shape color={secondary} opacity={0.8} style={styles.robotHead} />
          <Shape color={accent} opacity={0.9} style={styles.robotEyeOne} />
          <Shape color={accent} opacity={0.9} style={styles.robotEyeTwo} />
          <Shape color={accent} opacity={0.75} style={styles.robotBody} />
          <Shape color={secondary} opacity={0.68} style={styles.robotArm} />
          <Text style={[styles.sceneTinyText, styles.aiText]}>AI</Text>
        </View>
      );
    case 'education':
      return (
        <View style={styles.scene}>
          <Shape color={accent} opacity={0.82} style={styles.educationScreen} />
          <Shape color={secondary} opacity={0.7} style={styles.educationBook} />
          <Shape color="#ffffff" opacity={0.72} style={styles.eduLineOne} />
          <Shape color="#ffffff" opacity={0.72} style={styles.eduLineTwo} />
          <Text style={[styles.sceneTinyText, styles.eduText]}>DATA</Text>
        </View>
      );
    case 'visa':
      return (
        <View style={styles.scene}>
          <Shape color={secondary} opacity={0.78} style={styles.passport} />
          <Shape color={accent} opacity={0.85} style={styles.ticket} />
          <Shape color="#ffffff" opacity={0.6} style={styles.ticketLineOne} />
          <Shape color="#ffffff" opacity={0.6} style={styles.ticketLineTwo} />
          <Text style={[styles.sceneTinyText, styles.visaText]}>VISA</Text>
        </View>
      );
    case 'event':
      return (
        <View style={styles.scene}>
          <Shape color={secondary} opacity={0.72} style={styles.stadiumBowl} />
          <Shape color={accent} opacity={0.82} style={styles.stadiumField} />
          <Shape color="#ffffff" opacity={0.46} style={styles.stadiumLineOne} />
          <Shape color="#ffffff" opacity={0.46} style={styles.stadiumLineTwo} />
          <Shape color="#ffffff" opacity={0.58} style={styles.stadiumLight} />
        </View>
      );
    default:
      return null;
  }
}

function Shape({ border, color, opacity = 1, style }: ShapeProps) {
  return (
    <View
      style={[
        styles.shape,
        border ? { borderColor: color } : { backgroundColor: color },
        { opacity },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  cover: {
    height: 132,
    overflow: 'hidden',
  },
  shape: {
    position: 'absolute',
  },
  scene: {
    ...StyleSheet.absoluteFillObject,
  },
  backOrbLarge: {
    borderRadius: 92,
    height: 184,
    right: -48,
    top: -68,
    width: 184,
  },
  backOrbSmall: {
    borderRadius: 64,
    height: 128,
    left: -32,
    top: 36,
    width: 128,
  },
  diagonalWash: {
    height: 190,
    right: 48,
    top: -18,
    transform: [{ rotate: '-18deg' }],
    width: 58,
  },
  labelPanel: {
    backgroundColor: 'rgba(12, 22, 24, 0.24)',
    borderColor: 'rgba(255, 255, 255, 0.16)',
    borderRadius: 8,
    borderWidth: 1,
    bottom: 16,
    left: 16,
    paddingHorizontal: 12,
    paddingVertical: 9,
    position: 'absolute',
  },
  kicker: {
    color: 'rgba(255,255,255,0.68)',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0,
    marginBottom: 2,
  },
  label: {
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 29,
  },
  sceneTinyText: {
    color: 'rgba(255,255,255,0.88)',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0,
    position: 'absolute',
  },
  road: {
    borderRadius: 10,
    bottom: 8,
    height: 42,
    right: -4,
    transform: [{ rotate: '-4deg' }],
    width: 220,
  },
  routeBuildingOne: { height: 64, right: 132, top: 28, width: 28, borderRadius: 5 },
  routeBuildingTwo: { height: 48, right: 96, top: 44, width: 28, borderRadius: 5 },
  routeBuildingThree: { height: 78, right: 58, top: 16, width: 28, borderRadius: 5 },
  laneOne: { bottom: 32, right: 34, width: 42, height: 4, borderRadius: 4, transform: [{ rotate: '-4deg' }] },
  laneTwo: { bottom: 39, right: 104, width: 42, height: 4, borderRadius: 4, transform: [{ rotate: '-4deg' }] },
  carOne: { bottom: 44, right: 60, width: 52, height: 22, borderRadius: 7 },
  carTwo: { bottom: 24, right: 126, width: 44, height: 19, borderRadius: 7 },
  carWindowOne: { bottom: 56, right: 75, width: 20, height: 8, borderRadius: 4 },
  carWindowTwo: { bottom: 35, right: 139, width: 16, height: 7, borderRadius: 4 },
  careBuilding: { right: 48, top: 34, width: 114, height: 76, borderRadius: 12 },
  careRoof: { right: 84, top: 22, width: 42, height: 42, transform: [{ rotate: '45deg' }] },
  careWindowOne: { right: 126, top: 58, width: 20, height: 20, borderRadius: 5 },
  careWindowTwo: { right: 72, top: 58, width: 20, height: 20, borderRadius: 5 },
  personHeadOne: { right: 36, top: 78, width: 20, height: 20, borderRadius: 10 },
  personBodyOne: { right: 31, top: 98, width: 30, height: 23, borderRadius: 10 },
  personHeadTwo: { right: 170, top: 82, width: 18, height: 18, borderRadius: 9 },
  personBodyTwo: { right: 165, top: 101, width: 28, height: 20, borderRadius: 10 },
  evCarBody: { right: 52, bottom: 24, width: 126, height: 42, borderRadius: 18 },
  evCarTop: { right: 84, bottom: 58, width: 60, height: 28, borderRadius: 14 },
  evWindow: { right: 102, bottom: 65, width: 28, height: 12, borderRadius: 6 },
  chargeStation: { right: 30, top: 30, width: 30, height: 66, borderRadius: 8 },
  chargeCable: { right: 56, top: 62, width: 58, height: 5, borderRadius: 5, transform: [{ rotate: '24deg' }] },
  evWheelOne: { right: 76, bottom: 18, width: 16, height: 16, borderRadius: 8 },
  evWheelTwo: { right: 144, bottom: 18, width: 16, height: 16, borderRadius: 8 },
  evText: { right: 36, top: 48 },
  sun: { right: 46, top: 18, width: 54, height: 54, borderRadius: 27 },
  mountainOne: { right: 100, bottom: 18, width: 86, height: 86, transform: [{ rotate: '45deg' }], borderRadius: 10 },
  mountainTwo: { right: 42, bottom: 10, width: 80, height: 80, transform: [{ rotate: '45deg' }], borderRadius: 10 },
  waveA: { right: 28, bottom: 24, width: 154, height: 8, borderRadius: 8 },
  waveB: { right: 54, bottom: 42, width: 110, height: 7, borderRadius: 8 },
  cloudOne: { right: 70, top: 28, width: 100, height: 46, borderRadius: 23 },
  cloudTwo: { right: 34, top: 45, width: 98, height: 38, borderRadius: 20 },
  rainOne: { right: 68, top: 92, width: 8, height: 28, borderRadius: 6, transform: [{ rotate: '14deg' }] },
  rainTwo: { right: 104, top: 88, width: 8, height: 30, borderRadius: 6, transform: [{ rotate: '14deg' }] },
  rainThree: { right: 140, top: 92, width: 8, height: 24, borderRadius: 6, transform: [{ rotate: '14deg' }] },
  floodLineOne: { right: 30, bottom: 18, width: 150, height: 7, borderRadius: 7 },
  floodLineTwo: { right: 54, bottom: 35, width: 104, height: 7, borderRadius: 7 },
  schoolRoof: { right: 80, top: 22, width: 58, height: 58, transform: [{ rotate: '45deg' }], borderRadius: 5 },
  schoolMain: { right: 50, top: 62, width: 120, height: 54, borderRadius: 9 },
  schoolDoor: { right: 100, top: 84, width: 20, height: 32, borderRadius: 5 },
  crosswalkOne: { right: 178, bottom: 20, width: 34, height: 6, borderRadius: 4, transform: [{ rotate: '-12deg' }] },
  crosswalkTwo: { right: 142, bottom: 16, width: 34, height: 6, borderRadius: 4, transform: [{ rotate: '-12deg' }] },
  crosswalkThree: { right: 106, bottom: 12, width: 34, height: 6, borderRadius: 4, transform: [{ rotate: '-12deg' }] },
  schoolBus: { right: 34, bottom: 18, width: 50, height: 24, borderRadius: 7 },
  bookShelf: { right: 38, bottom: 26, width: 142, height: 10, borderRadius: 5 },
  bookOne: { right: 140, top: 28, width: 24, height: 70, borderRadius: 6 },
  bookTwo: { right: 104, top: 18, width: 24, height: 80, borderRadius: 6 },
  bookThree: { right: 68, top: 42, width: 24, height: 56, borderRadius: 6 },
  readingLamp: { right: 28, top: 26, width: 38, height: 38, borderRadius: 19 },
  lampGlow: { right: 16, top: 16, width: 64, height: 64, borderRadius: 32 },
  healthCard: { right: 44, top: 32, width: 132, height: 76, borderRadius: 14 },
  pulseOne: { right: 142, top: 72, width: 28, height: 5, borderRadius: 5 },
  pulseTwo: { right: 116, top: 55, width: 7, height: 38, borderRadius: 5 },
  pulseThree: { right: 74, top: 72, width: 48, height: 5, borderRadius: 5 },
  pillOne: { right: 46, top: 42, width: 36, height: 14, borderRadius: 10, transform: [{ rotate: '-24deg' }] },
  pillTwo: { right: 54, top: 90, width: 42, height: 14, borderRadius: 10, transform: [{ rotate: '18deg' }] },
  shopBody: { right: 48, top: 54, width: 126, height: 62, borderRadius: 10 },
  shopAwning: { right: 38, top: 36, width: 146, height: 24, borderRadius: 9 },
  shopDoor: { right: 132, top: 76, width: 24, height: 40, borderRadius: 5 },
  posScreen: { right: 44, top: 72, width: 42, height: 32, borderRadius: 6 },
  chartOne: { right: 96, top: 86, width: 8, height: 18, borderRadius: 3 },
  chartTwo: { right: 110, top: 76, width: 8, height: 28, borderRadius: 3 },
  chartThree: { right: 124, top: 66, width: 8, height: 38, borderRadius: 3 },
  officeTower: { right: 58, top: 24, width: 84, height: 96, borderRadius: 12 },
  officeWindowOne: { right: 116, top: 44, width: 18, height: 14, borderRadius: 4 },
  officeWindowTwo: { right: 86, top: 44, width: 18, height: 14, borderRadius: 4 },
  officeWindowThree: { right: 86, top: 72, width: 18, height: 14, borderRadius: 4 },
  leafOne: { right: 34, top: 74, width: 42, height: 22, borderRadius: 22, transform: [{ rotate: '-28deg' }] },
  leafTwo: { right: 148, top: 80, width: 36, height: 18, borderRadius: 20, transform: [{ rotate: '24deg' }] },
  energyTankOne: { right: 104, top: 38, width: 54, height: 74, borderRadius: 12 },
  energyTankTwo: { right: 48, top: 50, width: 46, height: 62, borderRadius: 11 },
  powerPole: { right: 172, top: 34, width: 8, height: 88, borderRadius: 5 },
  powerLineOne: { right: 92, top: 50, width: 88, height: 5, borderRadius: 5, transform: [{ rotate: '-16deg' }] },
  powerLineTwo: { right: 92, top: 74, width: 88, height: 5, borderRadius: 5, transform: [{ rotate: '12deg' }] },
  paymentPhone: { right: 88, top: 26, width: 58, height: 92, borderRadius: 14 },
  paymentCard: { right: 40, top: 56, width: 94, height: 50, borderRadius: 10, transform: [{ rotate: '6deg' }] },
  paymentLineOne: { right: 58, top: 74, width: 50, height: 5, borderRadius: 4 },
  paymentLineTwo: { right: 58, top: 90, width: 34, height: 5, borderRadius: 4 },
  payText: { right: 58, top: 62 },
  cranePole: { right: 156, top: 24, width: 8, height: 86, borderRadius: 4 },
  craneArm: { right: 76, top: 24, width: 88, height: 7, borderRadius: 4 },
  containerOne: { right: 80, top: 70, width: 78, height: 24, borderRadius: 5 },
  containerTwo: { right: 42, top: 96, width: 92, height: 22, borderRadius: 5 },
  shipHull: { right: 30, bottom: 8, width: 150, height: 22, borderRadius: 12 },
  portWater: { right: 28, bottom: 34, width: 154, height: 7, borderRadius: 7 },
  solarSun: { right: 48, top: 18, width: 48, height: 48, borderRadius: 24 },
  solarPanelOne: { right: 104, top: 66, width: 74, height: 48, borderRadius: 8, transform: [{ rotate: '-9deg' }] },
  solarPanelTwo: { right: 40, top: 72, width: 70, height: 42, borderRadius: 8, transform: [{ rotate: '8deg' }] },
  solarGridOne: { right: 116, top: 88, width: 48, height: 4, borderRadius: 3, transform: [{ rotate: '-9deg' }] },
  solarGridTwo: { right: 52, top: 92, width: 44, height: 4, borderRadius: 3, transform: [{ rotate: '8deg' }] },
  fieldOne: { right: 28, top: 48, width: 154, height: 20, borderRadius: 16, transform: [{ rotate: '-8deg' }] },
  fieldTwo: { right: 36, top: 76, width: 130, height: 18, borderRadius: 16, transform: [{ rotate: '-8deg' }] },
  fieldThree: { right: 52, top: 102, width: 112, height: 16, borderRadius: 16, transform: [{ rotate: '-8deg' }] },
  cropStemOne: { right: 142, top: 28, width: 5, height: 32, borderRadius: 4 },
  cropStemTwo: { right: 112, top: 34, width: 5, height: 28, borderRadius: 4 },
  cropStemThree: { right: 82, top: 30, width: 5, height: 34, borderRadius: 4 },
  runway: { right: 86, top: 30, width: 20, height: 88, borderRadius: 10, transform: [{ rotate: '18deg' }] },
  planeBody: { right: 42, top: 58, width: 130, height: 18, borderRadius: 14, transform: [{ rotate: '-12deg' }] },
  planeWing: { right: 90, top: 48, width: 22, height: 42, transform: [{ rotate: '-12deg' }] },
  planeTrailOne: { right: 136, top: 82, width: 48, height: 5, borderRadius: 5, transform: [{ rotate: '-12deg' }] },
  planeTrailTwo: { right: 150, top: 100, width: 36, height: 5, borderRadius: 5, transform: [{ rotate: '-12deg' }] },
  robotHead: { right: 62, top: 24, width: 92, height: 58, borderRadius: 16 },
  robotEyeOne: { right: 118, top: 48, width: 10, height: 10, borderRadius: 5 },
  robotEyeTwo: { right: 88, top: 48, width: 10, height: 10, borderRadius: 5 },
  robotBody: { right: 82, top: 88, width: 52, height: 36, borderRadius: 11 },
  robotArm: { right: 42, top: 74, width: 48, height: 9, borderRadius: 5, transform: [{ rotate: '-28deg' }] },
  aiText: { right: 92, top: 96 },
  educationScreen: { right: 48, top: 28, width: 120, height: 66, borderRadius: 11 },
  educationBook: { right: 76, top: 88, width: 70, height: 28, borderRadius: 8 },
  eduLineOne: { right: 68, top: 52, width: 78, height: 6, borderRadius: 5 },
  eduLineTwo: { right: 68, top: 70, width: 54, height: 6, borderRadius: 5 },
  eduText: { right: 82, top: 36 },
  passport: { right: 78, top: 28, width: 78, height: 88, borderRadius: 12, transform: [{ rotate: '-5deg' }] },
  ticket: { right: 36, top: 60, width: 96, height: 46, borderRadius: 10, transform: [{ rotate: '7deg' }] },
  ticketLineOne: { right: 54, top: 78, width: 54, height: 5, borderRadius: 4 },
  ticketLineTwo: { right: 54, top: 92, width: 36, height: 5, borderRadius: 4 },
  visaText: { right: 92, top: 50 },
  stadiumBowl: { right: 44, top: 32, width: 132, height: 80, borderRadius: 44 },
  stadiumField: { right: 76, top: 72, width: 70, height: 28, borderRadius: 18 },
  stadiumLineOne: { right: 72, top: 56, width: 78, height: 5, borderRadius: 4 },
  stadiumLineTwo: { right: 86, top: 104, width: 52, height: 5, borderRadius: 4 },
  stadiumLight: { right: 34, top: 20, width: 12, height: 46, borderRadius: 6 },
});
