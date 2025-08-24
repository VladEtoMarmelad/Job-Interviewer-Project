import '@/utils/polyfills'
import { Provider } from 'react-redux'
import { store } from '@/store';
import { AuthProvider } from '@/components/AuthProvider';
import { TabsLayout } from '@/components/TabsLayout';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <TabsLayout />
      </AuthProvider>
    </Provider>
  );
}
