// hoist

export const ProjectsListingSlugGroqQuery = (`
	*[_id == "projectsListing" && defined(slug)][0] {
		slug,
	}
`);

// partials

export const ComplexDateGroqPartial = (`
	startDate,
	endDate,
	hasDuration,
	isOngoing,
	dateFormat,
`);

export const SortDateGroqPartial = (`
	"sortDate": select(
		hasDuration == true && isOngoing == true => "ongoing",
		hasDuration == true && isOngoing == false => endDate,
		hasDuration == false && isOngoing == false => startDate,
	),
`);

export const ImageMetadataGroqPartial = (`
	"metadata": asset -> metadata {
		lqip,
		isOpaque,
		dimensions {
			height,
			width,
			aspectRatio,
		},
		palette,
		"extension": ^.asset -> extension,
	},
`);

export const ImageGroqPartial = (`
	...,
	${ImageMetadataGroqPartial}
`);

const PortableTextBlockGroqPartial = (`
	_type == "block" => {
		...,
		markDefs[] {
			...,
			_type == "link" && type == "internal" => {
				internalTarget -> {
					"type": _type,
					slug {
						current
					},
				},
			},
		},
	},
`);

const PortableTextImageGroqPartial = (`
	_type == "image" => {
		isUsedAsPlaceholder == true => {
			"asset": ^.^.^.^.image.asset,
			"caption": ^.^.^.^.image.caption[] {
				...,
				${PortableTextBlockGroqPartial}
			},
			"metadata": ^.^.^.^.image {
				${ImageMetadataGroqPartial}
			}.metadata,
		},
		isUsedAsPlaceholder != true => {
			asset,
			caption[] {
				...,
				${PortableTextBlockGroqPartial}
			},
			${ImageMetadataGroqPartial}
		},
		captionPlacement,
		captionPlacement == "left" || captionPlacement == "right" => {
			imageRatio,
			captionRatio,
			captionVerticalAlignment,
		},
	},
`);

const PortableTextTitleGroqPartial = (`
	_type == "title" => {
		"title": ^.^.^.^.title,
		"subtitle": ^.^.^.^.subtitle,
		"date": ^.^.^.^.date {
			${ComplexDateGroqPartial}
		},
		"types": ^.^.^.^.types[] -> {
			slug {
				current,
			},
			"type": "type",
			name,
		},
		"collections": ^.^.^.^.collections[] -> {
			slug {
				current,
			},
			"type": "collection",
			name,
			description[] {
				...,
				${PortableTextBlockGroqPartial}
			},
		},
		"subjects": ^.^.^.^.subjects[] -> {
			slug {
				current,
			},
			"type": "subject",
			name,
		},
		"locations": ^.^.^.^.locations[] -> {
			"type": "location",
			name,
			locale,
		},
		"baseUrl": ${ProjectsListingSlugGroqQuery}.slug.current,
	},
`);

const PortableTextDescriptionGroqPartial = (`
	_type == "description" => {
		defined(doesInclude) && "projectDescription" in doesInclude => {
			"projectDescription": ^.^.^.^.description[] {
				...,
				${PortableTextBlockGroqPartial}
			},
		},
		defined(doesInclude) && "collectionDescriptions" in doesInclude => {
			"collectionDescriptions": ^.^.^.^.collections[] -> {
				description[] {
					...,
					${PortableTextBlockGroqPartial}
				},
			},
		},
	},
`);

export const PortableTextGroqPartial = (`
	...,
	${PortableTextBlockGroqPartial}
	${PortableTextImageGroqPartial}
	${PortableTextTitleGroqPartial}
	${PortableTextDescriptionGroqPartial}
`);

export const ProjectBaseGroqPartial = (`
	slug {
		current,
	},
	title,
	subtitle,
	types[] -> {
		name,
	},
	collections[] -> {
		name,
	},
	subjects[] -> {
		name,
	},
	locations[] -> {
		name,
		locale,
	},
	image {
		asset,
		caption[] {
			${PortableTextGroqPartial}
		},
		${ImageGroqPartial}
	},
`);

// queries

export const SiteSettingsGroqQuery = (`
	*[_id == "settings"][0] {
		title,
		navigationItems[] -> {
			title,
			_id != "homepage" => {
				slug {
					current,
				},
			},
			_id == "homepage" => {
				"slug": {
					"current": "/",
				},
			},
		},
	}
`);

export const SimplePagesGroqQuery = (`
	*[_type == "simplePage" && defined(slug)] {
		slug {
			current,
		},
		title,
	}
`);

export const HomepageGroqQuery = (`
	*[_id == "homepage"][0] {
		title,
		"baseUrls": {
			"projectsListingBaseUrl": ${ProjectsListingSlugGroqQuery}.slug.current,
		},
		featuredProjects[] {
			project -> {
				slug {
					current,
				},
				title,
				subtitle,
			},
			doesUseProjectImage == true => {
				"image": project->image {
					${ImageGroqPartial}
				},
			},
			doesUseProjectImage != true => {
				"image": image {
					${ImageGroqPartial}
				},
			},
		},
	}
`);

export const ProjectsListingGroqQuery = (`
	*[_id == "projectsListing" && defined(slug)][0] {
		slug {
			current,
		},
		title,
		"allProjects": *[_type == "project" && defined(slug)] {
			slug {
				current,
			},
			title,
			subtitle,
			date {
				${ComplexDateGroqPartial}
				${SortDateGroqPartial}
			},
			types[] -> {
				slug {
					current,
				},
				name,
			},
			subjects[] -> {
				slug {
					current,
				},
				name,
			},
			collections[] -> {
				slug {
					current,
				},
				name,
				"description": pt::text(description[0]),
			},
			locations[] -> {
				slug {
					current,
				},
				name,
				locale,
			},
			image {
				${ImageGroqPartial}
			},
			"description": pt::text(description[0]),
		} | order(date.sortDate desc, date.startDate desc, lower(title) asc),
	}
`);

export const ProjectsGroqQuery = (`
	*[_type == "project" && defined(slug) && defined(date.startDate)] {
		${ProjectBaseGroqPartial}
		description[] {
			${PortableTextGroqPartial}
		},
		page.doesIncludeCredits => {
			credits[] {
				${PortableTextGroqPartial}
			},
		},
		page.doesIncludeRelatedProjects => {
			relatedProjects[] -> {
				${ProjectBaseGroqPartial}
				"description": pt::text(description[0]),
			},
		},
		page.doesIncludeRelatedNews => {
			relatedNews[] -> {
				"type": _type,
				slug {
					current,
				},
				title,
				date,
			},
		},
		page.doesIncludeRelatedPress => {
			relatedPress[] -> {
				"type": _type,
				url,
				date,
				title,
				publisher,
			},
		},
		page {
			body[] {
				doesBreakout,
				columns[] {
					_type,
					ratio,
					verticalAlignment,
					content[] {
						${PortableTextGroqPartial}
					},
				},
			},
			doesIncludeCredits,
			doesIncludeRelatedProjects,
			doesIncludeRelatedNews,
			doesIncludeRelatedPress,
		},
	}
`);