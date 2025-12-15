'use client'
import React, { ReactElement, useEffect, useState } from 'react'
import Dropdown from './Dropdown/Dropdown'
import { IconMoon, IconSun } from '@tabler/icons-react';
import DynamicTooltip from './Tooltip/DynamicToolTip';

const ThemeToggle = () => {
    const themes = ['dark', 'light', 'system'] as const;
    type Theme = typeof themes[number];
    const themeIcons: Record<Theme, ReactElement> = {
        light: <IconSun/>,
        dark: <IconMoon/>,
        system: <IconMoon/>,
    };
    const [isOpen, setOpen] = useState(false);
    const [theme, setTheme] = useState<Theme>('light');

    useEffect(() => {
        const currentTheme = localStorage.getItem('theme') as Theme;

        if(!currentTheme || !themes.includes(currentTheme)) {
            setTheme('light');
        } else {
            setTheme(currentTheme);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('theme', theme);
        document.documentElement.classList.toggle("dark", theme === "dark");
        setOpen(false);
    }, [theme]);

    return (
        <Dropdown
            toggleButton={(
                <DynamicTooltip text={theme}>
                    <button
                    className="nav-bar-btn"
                    onClick={() => setOpen(!isOpen)}
                    >
                        {themeIcons[theme]}
                    </button>
                </DynamicTooltip>
            )}
            isOpen={isOpen}
            setIsOpen={(isOpen) => setOpen(isOpen)}
        >
            <li onClick={() => setTheme('light')} className={`dropdown-item flex items-center gap-2 ${theme == 'light' ? 'active' : ''}`}>
                <IconSun/>
                Light
            </li>
            <li onClick={() => setTheme('dark')} className={`dropdown-item flex items-center gap-2 ${theme == 'dark' ? 'active' : ''}`}>
                <IconMoon/>
                Dark
            </li>
            {/* <li className={`dropdown-item flex items-center gap-2 ${false ? 'active' : ''}`}>
                <IconDeviceDesktop/>
                System
            </li> */}
        </Dropdown>
    )
}

export default ThemeToggle