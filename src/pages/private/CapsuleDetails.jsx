import { useParams } from "react-router-dom";

const CapsuleDetails = () => {
  const { capsuleId } = useParams();

  return (
    <div>
      <h1>Capsule Details</h1>
      <p>Capsule ID: {capsuleId}</p>
    </div>
  );
};

export default CapsuleDetails;
