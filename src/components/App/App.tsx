import Section from "../Section/Section";
import Container from "../Container/Container";
import Form from "../Form/Form";
import { getPhotos } from "../../services/photos";
import { useState } from "react";
import type { Photo } from "../../types/photo";

export default function App() {
  const [photos, setPhotos] = useState<Photo[]>([]);

  const handleSearch = async (value: string) => {
    const res = await getPhotos(value);
    setPhotos(res);
    console.log(photos);
  };
  return (
    <>
      <Section>
        <Container>
          <Form onSubmit={handleSearch} />
        </Container>
      </Section>
    </>
  );
}
