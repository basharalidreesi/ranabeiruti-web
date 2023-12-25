// hoist

export const ProjectsListingSlugGroqQuery = (`
	*[_id == "projectsListing" && defined(slug)][0] {
		slug {
			current,
		},
	}
`);

export const PublicationsListingSlugGroqQuery = (`
	*[_id == "publicationsListing" && defined(slug)][0] {
		slug {
			current,
		},
	}
`);

export const PressListingSlugGroqQuery = (`
	*[_id == "pressListing" && defined(slug)][0] {
		slug {
			current,
		},
	}
`);

// partials

const ComplexDateGroqPartial = (`
	startDate,
	endDate,
	hasDuration,
	isOngoing,
	dateFormat,
`);

const SortDateGroqPartial = (`
	"sortDate": select(
		hasDuration == true && isOngoing == true => "ongoing",
		hasDuration == true && isOngoing == false => endDate,
		hasDuration == false && isOngoing == false => startDate,
	),
`);

const ImageMetadataGroqPartial = (`
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

const ImageGroqPartial = (`
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

const PortableTextGroqPartial = (`
	...,
	${PortableTextBlockGroqPartial}
	${PortableTextImageGroqPartial}
	${PortableTextTitleGroqPartial}
	${PortableTextDescriptionGroqPartial}
`);

const PageBuilderBodyGroqPartial = (`
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
`);

const ProjectOrPublicationBaseGroqPartial = (`
	"type": _type,
	slug {
		current,
	},
	title,
	subtitle,
	_type == "project" => {
		date {
			${ComplexDateGroqPartial}
			${SortDateGroqPartial}
		},
	},
	_type == "publication" => {
		date,
	},
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

const ProjectOrPublicationExtendedGroqPartial = (`
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
			"type": _type,
			${ProjectOrPublicationBaseGroqPartial}
		},
	},
	page.doesIncludeRelatedPublications => {
		relatedPublications[] -> {
			"type": _type,
			${ProjectOrPublicationBaseGroqPartial}
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
			"description": pt::text(description[]),
		},
	},
	page.doesIncludeRelatedPress => {
		relatedPress[] -> {
			"type": _type,
			url,
			date,
			title,
			publisher,
			"description": pt::text(description[]),
		},
	},
	page {
		${PageBuilderBodyGroqPartial}
		doesIncludeCredits,
		doesIncludeRelatedProjects,
		doesIncludeRelatedPublications,
		doesIncludeRelatedNews,
		doesIncludeRelatedPress,
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
	*[_type == "page" && defined(slug)] {
		"type": _type,
		slug {
			current,
		},
		title,
		page {
			${PageBuilderBodyGroqPartial}
		},
	}
`);

export const HomepageGroqQuery = (`
	*[_id == "homepage"][0] {
		title,
		"baseUrls": {
			"projectsListingBaseUrl": ${ProjectsListingSlugGroqQuery}.slug.current,
			"publicationsListingBaseUrl": ${PublicationsListingSlugGroqQuery}.slug.current,
			"pressListingBaseUrl": ${PressListingSlugGroqQuery}.slug.current,
		},
		featuredItems[] {
			item -> {
				"type": _type,
				_type == "project" => {
					slug {
						current,
					},
					title,
					subtitle,
				},
				_type == "publication" => {
					slug {
						current,
					},
					title,
					subtitle,
				},
				_type == "news" => {
					slug {
						current,
					},
					title,
					date,
				},
				_type == "press" => {
					url,
					title,
					publisher,
					date,
				},
			},
			displayMode,
			doesUseDocumentImage == true => {
				"image": item->image {
					${ImageGroqPartial}
				},
			},
			doesUseDocumentImage != true => {
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
			"type": _type,
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
				"description": pt::text(description[]),
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
			"description": pt::text(description[]),
		} | order(date.sortDate desc, date.startDate desc, lower(title) asc),
	}
`);

export const ProjectsGroqQuery = (`
	*[_type == "project" && defined(slug) && defined(date.startDate)] {
		${ProjectOrPublicationBaseGroqPartial}
		${ProjectOrPublicationExtendedGroqPartial}
	}
`);

export const PressListingGroqQuery = (`
	*[_id == "pressListing" && defined(slug)][0] {
		slug {
			current,
		},
		"baseUrls": {
			"projectsListingBaseUrl": ${ProjectsListingSlugGroqQuery}.slug.current,
		},
		title,
		"allItems": *[(_type == "news" && defined(slug)) || (_type == "press" && defined(url))] {
			"type": _type,
			title,
			_type == "news" => {
				slug {
					current,
				},
				date,
				body[] {
					${PortableTextGroqPartial}
				},
			},
			_type == "press" => {
				url,
				publisher,
				date,
			},
			"description": pt::text(description[]),
			image {
				${ImageGroqPartial}
			},
			"relatedProjects": *[_type == "project" && defined(slug) && references(^._id)] {
				slug {
					current,
				},
				title,
			},
		} | order(date desc, lower(title) asc),
	}
`);

export const PublicationsListingGroqQuery = (`
	*[_id == "publicationsListing" && defined(slug)][0] {
		slug {
			current,
		},
		title,
		"allPublications": *[_type == "publication" && defined(slug)] {
			"type": _type,
			slug {
				current,
			},
			title,
			subtitle,
			date,
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
				"description": pt::text(description[]),
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
			"description": pt::text(description[]),
		} | order(date desc, lower(title) asc),
	}
`);

export const PublicationsGroqQuery = (`
	*[_type == "publication" && defined(slug) && defined(date)] {
		${ProjectOrPublicationBaseGroqPartial}
		${ProjectOrPublicationExtendedGroqPartial}
	}
`);