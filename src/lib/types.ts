import type { BasicProjectProps } from "@projects/[slug].astro";
import type { ImageFormat } from "@sanity/image-url/lib/types/types";
import type { SanityImagePalette } from "@sanity/client";
import type { SanityImageObject } from "@sanity/image-url/lib/types/types";
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
	type: "news";
	slug: { current: string; };
	title: string;
	date: string;
	description?: TypedObject[];
	body?: TypedObject[];
	image?: SanityImageObject & SanityImageMetadataObject;
	relatedProjects?: BasicProjectProps[];
};

export type PressProps = {
	type: "press";
	url: string;
	title: string;
	publisher: string;
	date: string;
	description?: TypedObject[];
	image?: SanityImageObject & SanityImageMetadataObject;
	relatedProjects?: BasicProjectProps[];
};

export type TagTypes = "types" | "collections" | "subjects" | "locations";

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

export type LocationProps = {
	type: "location";
	name: string;
	locale: string;
};

export type BaseUrls = {
	projectsListingBaseUrl?: string;
	publicationsListingBaseUrl?: string;
	pressListingBaseUrl?: string;
};