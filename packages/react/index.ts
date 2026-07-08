export { AccessGate, type AccessGateProps } from "./AccessGate.tsx";
export { useAccessGate } from "./useAccessGate.ts";
export { PinInput, type PinInputProps } from "./PinInput.tsx";
export type {
  AccessGateConfig,
  AccessGateError,
  AccessGateErrorReason,
  AccessGateLabels,
  AccessGateState,
  UseAccessGateResult,
} from "./types.ts";

export { GateWrapper, type GateWrapperProps, type GateWrapperVariant } from "./GateWrapper.tsx";
export { AccessGateProvider, useAccessGateContext, type AccessGateProviderProps } from "./AccessGateProvider.tsx";
export { ProtectedRoute, type ProtectedRouteProps } from "./ProtectedRoute.tsx";
export { ProtectedLayout, type ProtectedLayoutProps } from "./ProtectedLayout.tsx";
export { ProtectedModal, type ProtectedModalProps } from "./ProtectedModal.tsx";
export { UnlockDialog, type UnlockDialogProps } from "./UnlockDialog.tsx";
export { SessionTimeoutBanner, type SessionTimeoutBannerProps } from "./SessionTimeoutBanner.tsx";
export { AccessDeniedScreen, type AccessDeniedScreenProps } from "./AccessDeniedScreen.tsx";
export { VerificationLoader, type VerificationLoaderProps } from "./VerificationLoader.tsx";
export { LogoutButton, type LogoutButtonProps } from "./LogoutButton.tsx";
export { ProtectedCard, type ProtectedCardProps } from "./ProtectedCard.tsx";
export { StandaloneGate, type StandaloneGateProps } from "./StandaloneGate.tsx";
export { EmbeddedGate, type EmbeddedGateProps } from "./EmbeddedGate.tsx";
export {
  AccessGateTemplate,
  type AccessGateTemplateProps,
  type AccessGateTemplateLabels,
} from "./AccessGateTemplate.tsx";
export {
  MinimalAccessTemplate,
  type MinimalAccessTemplateProps,
  type MinimalAccessTemplateLabels,
} from "./MinimalAccessTemplate.tsx";
export {
  BrandedAccessTemplate,
  type BrandedAccessTemplateProps,
  type BrandedAccessTemplateLabels,
} from "./BrandedAccessTemplate.tsx";
export {
  ModalAccessTemplate,
  type ModalAccessTemplateProps,
  type ModalAccessTemplateLabels,
} from "./ModalAccessTemplate.tsx";
