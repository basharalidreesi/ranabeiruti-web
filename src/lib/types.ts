import type { ImageFormat } from "@sanity/image-url/lib/types/types";
import type { SanityImagePalette } from "@sanity/client";
import type { PortableTextProps } from "astro-portabletext/types";

export type SanityImageMetadataObject = {
	metadata: {
		lqip: string;
		isOpaque: boolean;
		dimensions: {
			height: number;
			width: number;
			aspectRatio: string;
		};
		palette: {
			muted: SanityImagePalette;
			lightMuted: SanityImagePalette;
			darkMuted: SanityImagePalette;
			vibrant: SanityImagePalette;
			lightVibrant: SanityImagePalette;
			darkVibrant: SanityImagePalette;
			dominant: SanityImagePalette;
		};
		extension: ImageFormat;
	};
};

export type VerticalAlignments = "top" | "middle" | "bottom";

export type CaptionPlacements = "left" | "top" | "right" | "bottom";

export type NewsProps = {
	slug: { current: string; };
	title: string;
	date: string;
	description: PortableTextProps[] | string;
	body: PortableTextProps[];
};

export type PressProps = {
	url: string;
	title: string;
	publisher: string;
	date: string;
	description: PortableTextProps[] | string;
};

export type LocationProps = {
	type: "location";
	name: string;
	locale: string;
};

export type TypeProps = {
	type: "type";
	slug: { current: string; };
	name: string;
};

export type CollectionProps = {
	type: "collection";
	slug: { current: string; };
	description: string | PortableTextProps[];
	name: string;
};

export type SubjectProps = {
	type: "subject";
	slug: { current: string; };
	name: string;
};