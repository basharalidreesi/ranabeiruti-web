import { createClient } from "@sanity/client";

const sanityClient = createClient({
	projectId: "rtlbcvty",
	dataset: "production",
	useCdn: true,
	apiVersion: "2023-10-01",
});

export default sanityClient;