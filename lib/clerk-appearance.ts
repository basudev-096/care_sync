/**
 * One appearance object shared by <SignIn> and <SignUp> so the two surfaces can
 * never drift apart visually. Maps Clerk's elements onto the CareClinic tokens.
 */
export const clerkAppearance = {
  variables: {
    colorPrimary: "#16202e",
    colorText: "#14181f",
    colorTextSecondary: "#5f6672",
    colorBackground: "#ffffff",
    colorInputBackground: "#ffffff",
    colorInputText: "#14181f",
    colorDanger: "#b42318",
    borderRadius: "0.375rem",
    fontFamily: "var(--font-sans)",
    fontSize: "0.9375rem",
  },
  elements: {
    rootBox: "w-full",
    cardBox: "w-full shadow-none border-0",
    card: "bg-transparent shadow-none w-full p-0 gap-5",
    header: "hidden",
    headerTitle: "hidden",
    headerSubtitle: "hidden",
    socialButtonsBlockButton:
      "border border-[#d8d8d3] bg-white hover:bg-[#f6f6f4] text-[#14181f] font-medium h-10 rounded-md transition-colors",
    socialButtonsBlockButtonText: "font-medium text-[0.9375rem]",
    dividerRow: "my-1",
    dividerLine: "bg-[#e3e3df]",
    dividerText: "text-[#5f6672] text-[0.8125rem]",
    formFieldLabel: "text-[#14181f] font-medium text-[0.8125rem] mb-1.5",
    formFieldInput:
      "bg-white border border-[#d8d8d3] text-[#14181f] h-10 rounded-md focus:border-[#0f6b5c] focus:ring-2 focus:ring-[#0f6b5c]/15 transition-shadow",
    formButtonPrimary:
      "bg-[#16202e] hover:bg-[#232f41] text-white font-medium h-10 rounded-md normal-case text-[0.9375rem] shadow-none transition-colors",
    footer: "hidden",
    footerAction: "hidden",
    identityPreviewText: "text-[#14181f]",
    identityPreviewEditButton: "text-[#0f6b5c] hover:text-[#0b4a3f]",
    formFieldErrorText: "text-[#b42318] text-[0.8125rem]",
    alertText: "text-[#b42318]",
    formFieldAction: "text-[#0f6b5c] hover:text-[#0b4a3f] font-medium",
    otpCodeFieldInput: "border-[#d8d8d3] text-[#14181f] rounded-md",
    formResendCodeLink: "text-[#0f6b5c] hover:text-[#0b4a3f] font-medium",
  },
} as const;
