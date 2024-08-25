import { Box, Container, Grid, styled, Typography } from "@mui/material";
import User from "../../../../assets/images/user.jpg";
import DownloadIcon from '@mui/icons-material/Download';
import EmailIcon from '@mui/icons-material/Email';
import StyledButton from "../../../../components/StyledButton/StyledButton";
import { AnimatedBackground } from "../../../../components/AnimatedBackground/AnimatedBackground";

const Hero = () => {

    const StyledHero = styled("div")(({ theme }) => ({
        position: "relative",
        backgroundColor: theme.palette.primary.main,
        height: "100vh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden" // Para evitar qualquer transbordamento do conteúdo
    }));

    const StyledImg = styled("img")(({ theme }) => ({
        width: "80%",
        borderRadius: "50%",
        border: `1px solid ${theme.palette.primary.contrastText}`
    }));

    return (
        <StyledHero>
            <Box
                position="absolute"
                top={0}
                left={0}
                width="100%"
                height="100%"
            >
                <AnimatedBackground />
            </Box>
            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={5}>
                        <Box position="relative" textAlign="center">
                            <StyledImg src={User} />
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={7}>
                        <Typography color="primary.contrastText" variant="h1" textAlign="center" paddingBottom={2}>Caio Dias</Typography>
                        <Typography color="primary.contrastText" variant="h2" textAlign="center">I'm a Full Stack Developer</Typography>
                        <Grid container display="flex" justifyContent="center" spacing={3} paddingTop={3}>
                            <Grid item xs={12} md={4} display="flex" justifyContent="center">
                                <StyledButton>
                                    <DownloadIcon /><Typography>Download CV</Typography>
                                </StyledButton>
                            </Grid>
                            <Grid item xs={12} md={4} display="flex" justifyContent="center">
                                <StyledButton><EmailIcon /><Typography>Contact me</Typography></StyledButton>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
        </StyledHero>
    );
};

export default Hero;
