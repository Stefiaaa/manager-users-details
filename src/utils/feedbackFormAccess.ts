const FORM_ACCESS_STORAGE_KEY = 'feedback_form_access';
const FORM_ACCESS_TTL_MS = 5 * 60 * 1000;

export const FEEDBACK_FORM_URL = 'https://forms.gle/8uhsLovUZXKVV9F68';

interface FormAccessData {
  token: string;
  issuedAt: number;
}

const createToken = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
};

export const createFormAccessSession = () => {
  const token = createToken();
  const data: FormAccessData = { token, issuedAt: Date.now() };
  sessionStorage.setItem(FORM_ACCESS_STORAGE_KEY, JSON.stringify(data));
  return token;
};

const readFormAccessSession = (): FormAccessData | null => {
  const raw = sessionStorage.getItem(FORM_ACCESS_STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as FormAccessData;
    if (!parsed?.token || !parsed?.issuedAt) return null;
    return parsed;
  } catch (error) {
    return null;
  }
};

export const isFormAccessValid = (token: string | null) => {
  if (!token) return false;
  const session = readFormAccessSession();
  if (!session || session.token !== token) return false;
  return Date.now() - session.issuedAt <= FORM_ACCESS_TTL_MS;
};

export const refreshFormAccessSession = (token: string) => {
  const data: FormAccessData = { token, issuedAt: Date.now() };
  sessionStorage.setItem(FORM_ACCESS_STORAGE_KEY, JSON.stringify(data));
};
