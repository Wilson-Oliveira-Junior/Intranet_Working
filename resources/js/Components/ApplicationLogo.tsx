import { ImgHTMLAttributes } from 'react';

interface ApplicationLogoProps extends ImgHTMLAttributes<HTMLDivElement> {
    size?: string;
}

export default function ApplicationLogo({ size = '10rem', ...props }: ApplicationLogoProps) {
    return (
        <div
            className="logo"
            style={{ width: size }}
            {...props}
        />
    );
}
