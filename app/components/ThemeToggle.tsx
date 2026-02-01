'use client'
import React, { ReactElement, useEffect, useState } from 'react'
import Dropdown from './Dropdown/Dropdown'
import { IconMoon, IconSun } from '@tabler/icons-react';
import DynamicTooltip from './Tooltip/DynamicToolTip';
import { DropdownItem } from './Dropdown/DropdownItem/DropdownItem';

const ThemeToggle = () => {
    const themes = ['dark', 'light', 'system'] as const;
    type Theme = typeof themes[number];
    const themeIcons: Record<Theme, ReactElement> = {
        light: <IconSun/>,
        dark: <IconMoon/>,
        system: <IconMoon/>,
    };
    const [isOpen, setOpen] = useState(false);
    const [theme, setTheme] = useState<Theme>(localStorage.getItem('theme') as Theme);

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
            <DropdownItem
            isActive={theme == 'light'}
            onClick={() => setTheme('light')}
            className={`flex items-center gap-2`}>
                <IconSun/>
                Light
            </DropdownItem>
            <DropdownItem
            isActive={theme == 'dark'}
            onClick={() => setTheme('dark')}
            className={`flex items-center gap-2`}>
                <IconMoon/>
                Dark
            </DropdownItem>
            {/* <li className={`dropdown-item flex items-center gap-2 ${false ? 'active' : ''}`}>
                <IconDeviceDesktop/>
                System
            </li> */}
        </Dropdown>
    )
}

export default ThemeToggle