import ProjectDetails from "../../../../src/views/ProjectDetails.jsx";

export default async function Page({ params }) {
  const { id } = await params;
  return <ProjectDetails id={id} />;
}
