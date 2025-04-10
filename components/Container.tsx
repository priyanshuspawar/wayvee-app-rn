import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { twMerge } from 'tailwind-merge';

export const Container = ({
  children,
  className,
  enableScroll = false,
}: {
  children: React.ReactNode;
  className?: string;
  enableScroll?: boolean;
}) => {
  return (
    <SafeAreaView
      className={twMerge(
        'relative flex w-screen flex-1 bg-neutral-n40',
        className
      )}>
      <ScrollView scrollEnabled={enableScroll}>{children}</ScrollView>
    </SafeAreaView>
  );
};
