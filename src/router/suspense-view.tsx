import { ReactNode, Suspense } from "react";
import SkeletonView from "./skeleton-view";

const SuspenseView = ({ children }: { children: ReactNode }) => {
  return <Suspense fallback={<SkeletonView />}>{children}</Suspense>;
};
export default SuspenseView;
