import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'duckdb-tutorial-settings';

interface Settings {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  showLineNumbers: boolean;
  autoMarkComplete: boolean;
}

const defaultSettings: Settings = {
  darkMode: false,
  fontSize: 'medium',
  showLineNumbers: true,
  autoMarkComplete: true,
};

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  // 从 localStorage 加载设置
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setSettings({ ...defaultSettings, ...JSON.parse(saved) });
      }
    } catch (e) {
      console.error('Failed to load settings:', e);
    }
  }, []);

  // 应用暗色模式
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  // 保存设置
  const saveSettings = useCallback((newSettings: Settings) => {
    setSettings(newSettings);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
  }, []);

  // 切换暗色模式
  const toggleDarkMode = useCallback(() => {
    saveSettings({ ...settings, darkMode: !settings.darkMode });
  }, [settings, saveSettings]);

  // 设置字体大小
  const setFontSize = useCallback((size: Settings['fontSize']) => {
    saveSettings({ ...settings, fontSize: size });
  }, [settings, saveSettings]);

  // 切换行号显示
  const toggleLineNumbers = useCallback(() => {
    saveSettings({ ...settings, showLineNumbers: !settings.showLineNumbers });
  }, [settings, saveSettings]);

  // 切换自动完成标记
  const toggleAutoComplete = useCallback(() => {
    saveSettings({ ...settings, autoMarkComplete: !settings.autoMarkComplete });
  }, [settings, saveSettings]);

  // 重置设置
  const resetSettings = useCallback(() => {
    saveSettings(defaultSettings);
  }, [saveSettings]);

  return {
    settings,
    toggleDarkMode,
    setFontSize,
    toggleLineNumbers,
    toggleAutoComplete,
    resetSettings,
  };
}
