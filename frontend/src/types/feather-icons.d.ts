declare module "feather-icons" {
  export type FeatherIconNames = string;
  export const icons: {
    [key: string]: {
      toSvg: (options?: {
        class?: string;
        color?: string;
        width?: number;
        height?: number;
        stroke?: string;
        fill?: string;
        style?: string;
        strokeWidth?: number;
      }) => string;
    };
  };
}
