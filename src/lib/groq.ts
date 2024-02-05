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
		(hasDuration == true || hasDuration == false) && isOngoing == false => startDate,
		hasDuration == true && isOngoing == false => endDate,
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
	"url": asset -> url,
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
						current,
					},
					title,
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
		"columnRatio": ^.ratio,
		"rowRatios": math::sum(^.^.columns[].ratio),
		"isBreakoutRow": ^.^.doesBreakout,
	},
`);

const PortableTextEmbedGroqPartial = (`
	_type == "embed" => {
		code,
		doesConstrainAspectRatio == true => {
			aspectRatio,
		},
	},
`);

const PortableTextSpacerGroqPartial = (`
	_type == "spacer" => {
		lineCount,
	},
`);

const PortableTextDocumentReferenceGroqPartial = (`
	_type == "documentReference" => {
		defined(reference) => {
			reference -> {
				"type": _type,
				_type == "project" || _type == "publication" || _type == "news" => {
					slug {
						current,
					},
				},
				_type == "project" || _type == "publication" => {
					subtitle,
					types[] -> {
						"type": "type",
						slug {
							current,
						},
						name,
					},
					collections[] -> {
						"type": "collection",
						slug {
							current,
						},
						name,
					},
					"description": pt::text(description[]),
				},
				_type == "project" => {
					date {
						${ComplexDateGroqPartial}
						${SortDateGroqPartial}
					},
				},
				_type == "publication" || _type == "press" || _type == "news" => {
					date,
				},
				_type == "press" => {
					url,
					publisher,
					"description": pt::text(description[]),
				},
				_type == "news" => {
					"body": pt::text(body[]),
				},
				title,
				image {
					asset,
					${ImageGroqPartial}
				},
			},
			"columnRatio": ^.ratio,
			"rowRatios": math::sum(^.^.columns[].ratio),
		},
	},
`);

const PortableTextCtaGroqPartial = (`
	_type == "cta" => {
		label,
		type,
		type == "internal" => {
			internalTarget -> {
				"type": _type,
				slug {
					current,
				},
				title,
			},
		},
		type == "external" => {
			externalTarget,
		},
	},
`);

const PortableTextTitleGroqPartial = (`
	_type == "title" => {
		"type": ^.^.^.^._type,
		"title": ^.^.^.^.title,
		"subtitle": ^.^.^.^.subtitle,
		^.^.^.^._type == "project" || ^.^.^.^._type == "story" => {
			"date": ^.^.^.^.date {
				${ComplexDateGroqPartial}
			},
		},
		^.^.^.^._type == "publication" || ^.^.^.^._type == "news" || ^.^.^.^._type == "press" => {
			"date": ^.^.^.^.date,
		},
		^.^.^.^._type == "project" || ^.^.^.^._type == "publication" => {
			"types": ^.^.^.^.types[] -> {
				"type": "type",
				slug {
					current,
				},
				name,
			},
			"collections": ^.^.^.^.collections[] -> {
				"type": "collection",
				slug {
					current,
				},
				name,
			},
			"subjects": ^.^.^.^.subjects[] -> {
				"type": "subject",
				slug {
					current,
				},
				name,
			},
			"locations": ^.^.^.^.locations[] -> {
				"type": "location",
				name,
				locale,
			},
		},
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
	${PortableTextEmbedGroqPartial}
	${PortableTextDocumentReferenceGroqPartial}
	${PortableTextCtaGroqPartial}
	${PortableTextSpacerGroqPartial}
	${PortableTextTitleGroqPartial}
	${PortableTextDescriptionGroqPartial}
`);

const PageBuilderBodyGroqPartial = (`
	body[] {
		doesBreakout,
		isEnabled,
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

const ProjectOrPublicationBase1GroqPartial = (`
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
	image {
		asset,
		caption[] {
			${PortableTextGroqPartial}
		},
		${ImageGroqPartial}
	},
`);

const ProjectOrPublicationBase2GroqPartial = (`
	${ProjectOrPublicationBase1GroqPartial}
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
			${ProjectOrPublicationBase1GroqPartial}
		},
	},
	page.doesIncludeRelatedPublications => {
		relatedPublications[] -> {
			${ProjectOrPublicationBase1GroqPartial}
		},
	},
	page {
		${PageBuilderBodyGroqPartial}
		doesIncludeCredits,
		doesIncludeRelatedProjects,
		doesIncludeRelatedPublications,
	},
`);

// queries

export const SiteSettingsGroqQuery = (`
	*[_id == "settings"][0] {
		title,
		description,
		navigationItems[] -> {
			"type": _type,
			"id": _id,
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
		image {
			"url": asset -> url,
			transformationQuery,
		},
		keywords,
		analytics,
	}
`);

export const HomepageGroqQuery = (`
	*[_id == "homepage"][0] {
		title,
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
					"body": pt::text(body[]),
				},
				_type == "press" => {
					url,
					title,
					publisher,
					date,
				},
				_type == "project" || _type == "publication" || _type == "press" => {
					"description": pt::text(description[]),
				},
				^.doesUseDocumentImage == true => {
					"image": image {
						${ImageGroqPartial}
					},
				},
				^.doesUseDocumentImage != true => {
					"image": ^.image {
						${ImageGroqPartial}
					},
				},
			},
			displayMode,
		},
		page {
			${PageBuilderBodyGroqPartial}
		},
	}
`);

export const ProjectsListingGroqQuery = (`
	*[_id == "projectsListing" && defined(slug)][0] {
		slug {
			current,
		},
		title,
		"allProjectsAndStories": (*[_type == "project" && defined(slug) && isListed == true] {
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
				"type": "type",
				slug {
					current,
				},
				name,
			},
			subjects[] -> {
				"type": "subject",
				slug {
					current,
				},
				name,
			},
			collections[] -> {
				"type": "collection",
				slug {
					current,
				},
				name,
			},
			locations[] -> {
				"type": "location",
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
			isListed,
			listingAlignment,
			listingDisplaySize,
		} + *[_type == "story"] {
			"type": _type,
			date {
				${ComplexDateGroqPartial}
				${SortDateGroqPartial}
			},
			body[] {
				${PortableTextGroqPartial}
			},
		}) | order(date.sortDate desc, date.startDate desc, type desc, lower(title) asc),
	}
`);

export const ProjectsGroqQuery = (`
	*[_type == "project" && defined(slug) && defined(date.startDate)] {
		${ProjectOrPublicationBase2GroqPartial}
		${ProjectOrPublicationExtendedGroqPartial}
	}
`);

export const PressListingGroqQuery = (`
	*[_id == "pressListing" && defined(slug)][0] {
		slug {
			current,
		},
		title,
		"allNewsAndPressItems": *[(_type == "news" && defined(slug)) || (_type == "press" && defined(url))] {
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
				"description": pt::text(description[]),
			},
			image {
				${ImageGroqPartial}
			},
			"relatedProjectsAndPublications": (*[_type == "project" && defined(slug) && (^._id in relatedPress[]._ref || ^._id in relatedNews[]._ref)] {
				"type": _type,
				slug {
					current,
				},
				title,
			} + *[_type == "publication" && defined(slug) && (^._id in relatedPress[]._ref || ^._id in relatedNews[]._ref)] {
				"type": _type,
				slug {
					current,
				},
				title,
			}),
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
				"type": "type",
				slug {
					current,
				},
				name,
			},
			subjects[] -> {
				"type": "subject",
				slug {
					current,
				},
				name,
			},
			collections[] -> {
				"type": "collection",
				slug {
					current,
				},
				name,
			},
			locations[] -> {
				"type": "location",
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
		${ProjectOrPublicationBase2GroqPartial}
		${ProjectOrPublicationExtendedGroqPartial}
	}
`);