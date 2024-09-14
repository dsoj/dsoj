import Layout from "@/components/Layout";
import about_info from "@/constants/about_information";
import Link from "next/link";
import { ReactElement } from "react";
import { Container, Row, Col, Card, Button } from 'react-bootstrap';


export default function About({ about_data }: any) {
    const { card_data, github_data } = about_data;
// TODO: fix it
    function generateAboutCard() {
        let about_cards: ReactElement[] = [];

        for (const [key, value] of card_data) {
            about_cards.push(
                <Col md={6}>
                    <Card>
                        <Card>
                            <Card.Title>{key}</Card.Title>
                            <Card.Text>
                                {value ?? ""}
                            </Card.Text>
                        </Card>
                    </Card>
                </Col>
            );
        }
        return about_cards;
    }

    return (
        <Layout>
            <Container className="mt-5">
                <Row>
                    <Col>
                        <h1>About Us</h1>
                        <p>

                        </p>
                    </Col>
                </Row>
                <Row className="mt-4">
                    {/* {generateAboutCard()} */}
                </Row>
                <Row className="mt-4">
                    <Col>
                        <Button
                            href={github_data.repo_link}
                            target="_blank"
                            variant="dark"
                        >
                            <i className="bi bi-github"></i>
                            &nbsp;
                            {github_data.repo_name}
                        </Button>
                    </Col>
                    <Col>
                        <Link className="link-secondary" href={github_data.project_link}>
                            Wanna Contribute? View more on GitHub Project!
                        </Link>
                    </Col>
                </Row>
            </Container>
        </Layout>
    );
}

export async function getStaticProps() {
    return {
        props: {
            about_data: about_info
        }
    }
}