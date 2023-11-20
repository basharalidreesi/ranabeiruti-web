import { createClient } from "@sanity/client";

const sanityClient = createClient({
	projectId: "rtlbcvty",
	dataset: "production",
	useCdn: false,
	apiVersion: "2023-10-01",
});

export default sanityClient;