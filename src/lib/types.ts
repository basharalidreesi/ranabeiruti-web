export type SiteSettingsProps = {
	title: string;
	navigationItems: {
		title: string;
		slug: {
			current: string;
		};
	}[];
};

export type ProjectsListingProps = {
	slug: { current: string; };
	title: string;
	allProjects: ProjectProps[];
	quicklinks?: {
		title: string;
		items: ({
			_type: "linkToItem";
			slug: { current: string; };
			title: string;
		} | {
			_type: "filterByTag";
			schemaType: "type_" | "collection" | "subject" | "location";
			slug: { current: string; };
			name: string;
		} | {
			_type: "filterByDate";
			year: number;
		} | {
			_type: "customFilter";
			label: string;
			tags: {
				schemaType: "type_" | "collection" | "subject" | "location";
				slug: { current: string; };
			}[];
		})[];
	}[];
};
export type ProjectGroupingProps = {
	[key: string]: {
		title: string;
		projects: ProjectProps[];
		description?: string;
	};
};

export type ProjectProps = {
	slug: { current: string; };
	title: string;
	subtitle?: string;
	date: ProjectDateProps;
	locations?: LocationProps[];
	types: TypeProps[];
	subjects?: SubjectProps[];
	collections?: CollectionProps[];
	image: any;
	description?: PortableTextProps;
	credits?: PortableTextProps;
	relatedNews?: {
		_type: "news";
		slug: { current: string; };
		title: string;
		date: string;
		description: PortableTextProps;
		body: PortableTextProps;
	}[];
	relatedPress?: {
		_type: "press";
		url: string;
		title: string;
		publisher: string;
		date: string;
		description: PortableTextProps;
	}[];
	relatedProjects?: {
		slug: { current: string; };
		title: string;
		subtitle?: string;
		date: ProjectDateProps;
		types: TypeProps[];
		collections?: CollectionProps[];
		subjects?: SubjectProps[];
		locations?: LocationProps[];
		description?: string;
		image: any;
	}[];
	page: {
		header: [];
		doesIncludeDescription: boolean;
		doesIncludeCollections: boolean;
		body: [];
		doesIncludeCredits: boolean;
		doesIncludeRelatedProjects: boolean;
		doesIncludeRelatedNews: boolean;
		doesIncludeRelatedPress: boolean;
	};
};
export interface ProjectDateProps extends ComplexDateProps {
	sortDate: string;
};

export type ComplexDateProps = {
	startDate: string;
	endDate: string;
	hasDuration: boolean;
	isOngoing: boolean;
	dateFormat: ComplexDateFormats;
};
export type ComplexDateFormats = "fullDate" | "yearWithMonth" | "yearOnly";

export type TypeProps = {
	type: "type";
	slug: { current: string; };
	name: string;
};
export type CollectionProps = {
	type: "collection";
	slug: { current: string; };
	name: string;
	description: PortableTextProps;
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

export type PortableTextProps = [];