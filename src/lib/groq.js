export const complexDateGroqPartial = (`
	startDate,
	endDate,
	hasDuration,
	isOngoing,
	dateFormat,
`);

export const sortDateGroqPartial = (`
	"sortDate": select(
		hasDuration == true && isOngoing == true => "ongoing",
		hasDuration == true && isOngoing == false => endDate,
		hasDuration == false && isOngoing == false => startDate,
	),
`);

const _portableTextTypeBlock = (`
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

const _portableTextTypeImage = (`
	_type == "image" => {
		isUsedAsPlaceholder == true => {
			"asset": ^.^.^.^.image { asset }.asset,
			"caption": ^.^.^.^.image.caption[] {
				...,
				${_portableTextTypeBlock}
			},
		},
		isUsedAsPlaceholder == "false" => {
			asset,
			caption[] {
				...,
				${_portableTextTypeBlock}
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

export const portableTextGroqPartial = (`
	...,
	${_portableTextTypeBlock}
	${_portableTextTypeImage}
`);

export const projectsListingGroqQuery = (`
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
				${complexDateGroqPartial}
				${sortDateGroqPartial}
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