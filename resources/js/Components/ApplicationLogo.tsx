import { ImgHTMLAttributes } from 'react';

interface ApplicationLogoProps extends ImgHTMLAttributes<HTMLImageElement> {
    size?: string;
}

export default function ApplicationLogo({ size = '200px', ...props }: ApplicationLogoProps) {
    return (
        <img
            src="/img/logo.png"
            alt="Logo"
            style={{ width: size }}
            {...props}
        />
    );
}
