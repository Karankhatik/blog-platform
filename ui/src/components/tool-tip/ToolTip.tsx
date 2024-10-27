import React, { ReactNode } from 'react';

interface ToolTipProps {
    text: string;
    children?: ReactNode;
}

export const TopToolTip: React.FC<ToolTipProps> = ({ text, children }) => {
    return (
        <div className="group relative">
            {children}
            <div className="bg-toolTipBG p-2 rounded-md group-hover:flex hidden absolute -top-2 -translate-y-full left-1/2 -translate-x-1/2">
                <span className="text-toolTipText whitespace-nowrap">{text}</span>
                <div className="bg-inherit rotate-45 p-1 absolute bottom-0 translate-y-1/2 left-1/2 -translate-x-1/2"></div>
            </div>
        </div>
    );
};

export const LeftToolTip: React.FC<ToolTipProps> = ({ text, children }) => {
    return (
        <div className="group relative">
            {children}
            <div className="bg-toolTipBG p-2 rounded-md group-hover:flex hidden absolute -top-2 -translate-y-full left-1/2 -translate-x-1/2">
                <span className="text-toolTipText whitespace-nowrap">{text}</span>
                <div className="bg-inherit rotate-45 p-1 absolute bottom-0 translate-y-1/2 left-1/2 -translate-x-1/2"></div>
            </div>
        </div>
    );
};

export const RightToolTip: React.FC<ToolTipProps> = ({ text, children }) => {
    return (
        <div className="group relative">
            {children}
            <div className="bg-toolTipBG p-2 rounded-md group-hover:flex hidden absolute -top-2 -translate-y-full left-1/2 -translate-x-1/2">
                <span className="text-toolTipText whitespace-nowrap">{text}</span>
                <div className="bg-inherit rotate-45 p-1 absolute bottom-0 translate-y-1/2 left-1/2 -translate-x-1/2"></div>
            </div>
        </div>
    );
};

export const BottomToolTip: React.FC<ToolTipProps> = ({ text, children }) => {
    return (
        <div className="group relative">
            {children}
            <div className="bg-toolTipBG p-2 rounded-md group-hover:flex hidden absolute -top-2 -translate-y-full left-1/2 -translate-x-1/2">
                <span className="text-toolTipText whitespace-nowrap">{text}</span>
                <div className="bg-inherit rotate-45 p-1 absolute bottom-0 translate-y-1/2 left-1/2 -translate-x-1/2"></div>
            </div>
        </div>
    );
};
