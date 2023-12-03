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
	},
`);

const PortableTextTypeBlock = (`
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

const PortableTextTypeImage = (`
	_type == "image" => {
		isUsedAsPlaceholder == true => {
			"asset": ^.^.^.^.image { asset }.asset,
			"caption": ^.^.^.^.image.caption[] {
				...,
				${PortableTextTypeBlock}
			},
		},
		isUsedAsPlaceholder == "false" => {
			asset,
			caption[] {
				...,
				${PortableTextTypeBlock}
			},
		},
		captionPlacement,
		captionPlacement == "left" || captionPlacement == "right" => {
			imageRatio,
			captionRatio,
			captionVerticalAlignment,
		},
	},
`);

export const PortableTextGroqPartial = (`
	...,
	${PortableTextTypeBlock}
	${PortableTextTypeImage}
`);

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

export const ProjectsListingSlugGroqQuery = (`
	*[_id == "projectsListing" && defined(slug)][0] {
		slug,
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
				asset,
			},
			"description": pt::text(description[0]),
		} | order(date.sortDate desc, date.startDate desc, lower(title) asc),
		quicklinks[] {
			title,
			items[] {
				_type,
				_type == "linkToItem" => @-> {
					slug {
						current,
					},
					title,
				},
				_type == "filterByTag" => @-> {
					"schemaType": _type,
					slug {
						current,
					},
					name,
				},
				_type == "filterByDate" => {
					year,
				},
				_type == "customFilter" => {
					label,
					tags[] -> {
						"schemaType": _type,
						slug {
							current,
						},
					},
				},
			},
		},
	}
`);

export const ProjectBaseGroqPartial = (`
	slug {
		current,
	},
	title,
	subtitle,
	profiles[] -> {
		name,
	} | order(lower(name) desc),
	date {
		startDate,
		endDate,
		hasDuration,
		isOngoing,
		dateFormat,
	},
	types[] -> {
		slug {
			current,
		},
		"type": "type",
		name,
	},
	collections[] -> {
		slug {
			current,
		},
		"type": "collection",
		name,
		description[] {
			${PortableTextGroqPartial}
		},
	},
	subjects[] -> {
		slug {
			current,
		},
		"type": "subject",
		name,
	},
	locations[] -> {
		"type": "location",
		name,
		locale,
	},
	image {
		asset,
		caption[] {
			${PortableTextGroqPartial}
		},
	},
`);

export const ProjectGroqQuery = (`
	*[_type == "project" && defined(slug) && defined(date.startDate)] {
		${ProjectBaseGroqPartial}
		description[] {
			${PortableTextGroqPartial}
		},
		credits[] {
			${PortableTextGroqPartial}
		},
		relatedProjects[] -> {
			${ProjectBaseGroqPartial}
			"description": pt::text(description[0]),
		},
		relatedNews[] -> {
			_type,
			slug {
				current,
			},
			title,
			date,
		},
		relatedPress[] -> {
			_type,
			url,
			date,
			title,
			publisher,
		},
		page {
			header[] {
				doesBreakout,
				columns[] {
					_type,
					ratio,
					verticalAlignment,
					_type == "image_" => {
						captionPlacement,
						captionPlacement == "left" || captionPlacement == "right" => {
							imageRatio,
							captionRatio,
							captionVerticalAlignment,
						},
					},
				},
			},
			doesIncludeDescription,
			doesIncludeCollections,
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