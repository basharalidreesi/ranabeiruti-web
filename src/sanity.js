import { createClient } from "@sanity/client";

const sanityClient = createClient({
	projectId: "rtlbcvty",
	dataset: "staging",
	useCdn: false,
	apiVersion: "2023-10-01",
});

export default sanityClient;