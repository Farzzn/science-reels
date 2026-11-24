import { Composition, staticFile, Still } from "remotion";
import { EmailThumbnail } from "./FiveHundredMileEmail/Thumbnail";
import {
  CaptionedVideo,
  calculateCaptionedVideoMetadata,
  captionedVideoSchema,
} from "./CaptionedVideo";
import {
  CLOUDFLARE_REEL_DURATION_FRAMES,
  CloudflareLavaLamps,
} from "./CloudflareLavaLamps";
import {
  LOW_BG_STEEL_DURATION_FRAMES,
  LowBackgroundSteel,
} from "./LowBackgroundSteel";
import {
  MEMS_GYRO_DURATION_FRAMES,
  MemsGyroscope,
} from "./MemsGyroscope";
import {
  calculateFeynmanMetadata,
  FEYNMAN_LIGHT_PATH_DURATION_FRAMES,
  FeynmanLightPath,
} from "./FeynmanLightPath";
import {
  PLANCK_MIDPOINT_DURATION_FRAMES,
  PlanckLogMidpoint,
} from "./PlanckLogMidpoint";
import {
  QUANTUM_FLASH_DURATION_FRAMES,
  QuantumFlashMemory,
} from "./QuantumFlashMemory";
import {
  HOW_NUMBERS_THINK_DURATION_FRAMES,
  HowNumbersThink3D,
} from "./HowNumbersThink3D";
import {
  HOW_RGB_TRICKS_DURATION_FRAMES,
  HowRGBTricksYourBrain3D,
} from "./HowRGBTricksYourBrain3D";
import {
  HOW_QUARTZ_SLICES_TIME_DURATION_FRAMES,
  HowQuartzSlicesTime3D,
} from "./HowQuartzSlicesTime3D";
import {
  SILICON_CHIP_3D_DURATION_FRAMES,
  SiliconChip3D,
} from "./SiliconChip3D";
import {
  FIVE_HUNDRED_MILE_FRAMES,
  FiveHundredMileEmail,
} from "./FiveHundredMileEmail";
import {
  FIVE_HUNDRED_MILE_SHORT_FRAMES,
  FiveHundredMileShort,
} from "./FiveHundredMileEmail/Short";
import {
  COSMIC_MARIO_FRAMES,
  CosmicMarioBitFlip,
} from "./CosmicMario";
import {
  COSMIC_MARIO_SHORT_FRAMES,
  CosmicMarioShort,
} from "./CosmicMario/Short";
import { CosmicThumbnail } from "./CosmicMario/Thumbnail";
import { GRAVITY_ENERGY_FRAMES, GravityEnergy } from "./GravityEnergy";
import { GRAVITY_SHORT_FRAMES, GravityEnergyShort } from "./GravityEnergy/Short";
import { GravityThumbnail } from "./GravityEnergy/Thumbnail";
import { CASIMIR_EFFECT_FRAMES, CasimirEffect } from "./CasimirEffect";
import { CASIMIR_SHORT_FRAMES, CasimirEffectShort } from "./CasimirEffect/Short";
import { CasimirThumbnail } from "./CasimirEffect/Thumbnail";
import { MACRO_TUNNEL_FRAMES, MacroscopicTunneling } from "./MacroscopicTunneling";
import { MACRO_TUNNEL_SHORT_FRAMES, MacroscopicTunnelingShort } from "./MacroscopicTunneling/Short";
import { MacroscopicThumbnail } from "./MacroscopicTunneling/Thumbnail";
import { REL_BONDS_FRAMES, RelativityChemicalBonds } from "./RelativityBonds";
import { RelativityBondsThumbnail } from "./RelativityBonds/Thumbnail";

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="RelativityChemicalBonds"
        component={RelativityChemicalBonds}
        durationInFrames={REL_BONDS_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Still id="RelativityBondsThumbnail" component={RelativityBondsThumbnail} width={1920} height={1080} />
      <Composition
        id="MacroscopicTunnelingShort"
        component={MacroscopicTunnelingShort}
        durationInFrames={MACRO_TUNNEL_SHORT_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="MacroscopicTunneling"
        component={MacroscopicTunneling}
        durationInFrames={MACRO_TUNNEL_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Still id="MacroscopicThumbnail" component={MacroscopicThumbnail} width={1920} height={1080} />
      <Composition
        id="CasimirEffectShort"
        component={CasimirEffectShort}
        durationInFrames={CASIMIR_SHORT_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="CasimirEffect"
        component={CasimirEffect}
        durationInFrames={CASIMIR_EFFECT_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Still id="CasimirThumbnail" component={CasimirThumbnail} width={1920} height={1080} />
      <Composition
        id="GravityEnergyShort"
        component={GravityEnergyShort}
        durationInFrames={GRAVITY_SHORT_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="GravityEnergy"
        component={GravityEnergy}
        durationInFrames={GRAVITY_ENERGY_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Still id="GravityThumbnail" component={GravityThumbnail} width={1920} height={1080} />
      <Composition
        id="CosmicMarioShort"
        component={CosmicMarioShort}
        durationInFrames={COSMIC_MARIO_SHORT_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="CosmicMarioBitFlip"
        component={CosmicMarioBitFlip}
        durationInFrames={COSMIC_MARIO_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Still id="CosmicThumbnail" component={CosmicThumbnail} width={1920} height={1080} />
      <Composition
        id="FiveHundredMileShort"
        component={FiveHundredMileShort}
        durationInFrames={FIVE_HUNDRED_MILE_SHORT_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="FiveHundredMileEmail"
        component={FiveHundredMileEmail}
        durationInFrames={FIVE_HUNDRED_MILE_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Still id="EmailThumbnail" component={EmailThumbnail} width={1920} height={1080} />
      <Composition
        id="HowQuartzSlicesTime3D"
        component={HowQuartzSlicesTime3D}
        durationInFrames={HOW_QUARTZ_SLICES_TIME_DURATION_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="HowRGBTricksYourBrain3D"
        component={HowRGBTricksYourBrain3D}
        durationInFrames={HOW_RGB_TRICKS_DURATION_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="HowNumbersThink3D"
        component={HowNumbersThink3D}
        durationInFrames={HOW_NUMBERS_THINK_DURATION_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="SiliconChip3D"
        component={SiliconChip3D}
        durationInFrames={SILICON_CHIP_3D_DURATION_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="FeynmanLightPath"
        component={FeynmanLightPath}
        calculateMetadata={calculateFeynmanMetadata}
        durationInFrames={FEYNMAN_LIGHT_PATH_DURATION_FRAMES}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
      <Composition
        id="PlanckLogMidpoint"
        component={PlanckLogMidpoint}
        durationInFrames={PLANCK_MIDPOINT_DURATION_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="MemsGyroscope"
        component={MemsGyroscope}
        durationInFrames={MEMS_GYRO_DURATION_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="LowBackgroundSteel"
        component={LowBackgroundSteel}
        durationInFrames={LOW_BG_STEEL_DURATION_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="QuantumFlashMemory"
        component={QuantumFlashMemory}
        durationInFrames={QUANTUM_FLASH_DURATION_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="CloudflareLavaLamps"
        component={CloudflareLavaLamps}
        durationInFrames={CLOUDFLARE_REEL_DURATION_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="CaptionedVideo"
        component={CaptionedVideo}
        calculateMetadata={calculateCaptionedVideoMetadata}
        schema={captionedVideoSchema}
        width={1080}
        height={1920}
        defaultProps={{
          src: staticFile("sample-video.mp4"),
        }}
      />
    </>
  );
};
