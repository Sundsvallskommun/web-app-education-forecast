import { redirect } from 'next/navigation';
import i18nConfig from './i18nConfig';

export default function RootIndex() {
  redirect(`/${i18nConfig.defaultLocale}`);
}
