import { currentUser } from "@clerk/nextjs";
import PlaceDetails from "../_components/PlaceDetails";

export default async function SinglePlace({ params }: { params: { placeId: string } }) {
    const user = await currentUser();

    return (
        <PlaceDetails placeId={params.placeId} user={user?.id} />
    )
}