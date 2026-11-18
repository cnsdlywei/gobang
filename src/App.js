import { useEffect, useState } from 'react';
import { ConfigProvider, theme as antdTheme } from 'antd';
import Board from './components/board';
import Control from './components/control';
import './App.css';
import packageInfo from '../package.json';

const LAST_UPDATED = '2026-09-02';

const getInitialTheme = () => {
  const savedTheme = window.localStorage.getItem('gobang-theme');
  if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

function App() {
  const [theme, setTheme] = useState(getInitialTheme);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const onFullscreenChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem('gobang-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((current) => current === 'dark' ? 'light' : 'dark');

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await document.documentElement.requestFullscreen();
      }
    } catch (err) {
      console.error('全屏切换失败：', err);
    }
  };

  return (
    <ConfigProvider theme={{
      algorithm: theme === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
      token: {
        colorPrimary: theme === 'dark' ? '#74b98e' : '#2d6a4f',
        borderRadius: 10,
        fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
      },
    }}>
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <div className="brand-mark" aria-hidden="true"><span /><span /></div>
          <div>
            <h1>五子棋</h1>
            <p>与搜索引擎来一场安静的对弈</p>
          </div>
        </div>
        <div className="header-actions">
          <button className="theme-toggle" type="button" onClick={toggleFullscreen} aria-label={isFullscreen ? '退出全屏' : '进入全屏'}>
            <span aria-hidden="true">{isFullscreen ? '⤢' : '⛶'}</span>
            {isFullscreen ? '非全屏' : '全屏'}
          </button>
          <button className="theme-toggle" type="button" onClick={toggleTheme} aria-label={`切换到${theme === 'dark' ? '亮色' : '暗色'}模式`}>
            <span aria-hidden="true">{theme === 'dark' ? '☀' : '☾'}</span>
            {theme === 'dark' ? '亮色' : '暗色'}
          </button>
        </div>
      </header>

      <main className="game-layout">
        <section className="board-panel" aria-label="五子棋棋盘">
          <div className="board-heading">
            <div><span className="eyebrow">15 × 15 · 无禁手&emsp;&emsp;&emsp;&emsp;卓越出品</span><h2>对局</h2></div>
            <span className="engine-badge"><i /> AI Engine</span>
          </div>
          <Board />
        </section>
        <aside className="side-panel"><Control /></aside>
      </main>

      <footer className="app-version">Gobang AI · v{packageInfo.version} · {LAST_UPDATED}</footer>
    </div>
    </ConfigProvider>
  );
}

export default App;
