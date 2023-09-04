'use client';
import React from "react";

import styles from "./Navbar.module.scss";
import { Logo } from "../../Logo/Logo";
import { NAV_LINKS } from "@/constants/links";
import { Button } from "../../Button/Button";
import { Connect } from "../../ConnectWallet/Connect";
import { IconMenu, IconMenu2, IconX } from "@tabler/icons-react";
import { AnimatePresence, cubicBezier, motion } from "framer-motion";

export const Navbar = (): JSX.Element => {
    const [openMenu, setOpenMenu] = React.useState<boolean>(false);

    const toggleMenu = () => setOpenMenu(!openMenu);

    return (
        <nav className={styles.navbar}>
            <Logo />
            <IconMenu2 className={styles.navbar_menuIcon} onClick={toggleMenu} />
            <AnimatePresence>
                {
                    openMenu ? (
                        <motion.section 
                            className={styles.navbar_links}
                            initial={{height: "auto"}}
                            animate={{height: "100vh"}}
                            exit={{height: "auto"}}
                            transition={{duration: 0.1, ease: cubicBezier(0.6,0.6,0,0.1)}}
                        >
                            {
                                NAV_LINKS.map((link, index) => (
                                    <Button 
                                        key={index} 
                                        type="link"
                                        redirectTo={link[1]}
                                    >{link[0]}</Button>
                                ))
                            }
                            <Connect />
                            <Button
                                type="link"
                                className={styles.navbar_menuClose}
                                onClick={toggleMenu}
                            >
                                <IconX /> Cerrar menu
                            </Button>
                        </motion.section>
                    ) : null
                }
            </AnimatePresence>
            <section 
                className={styles.navbar_linksDesktop}
            >
                {
                    NAV_LINKS.map((link, index) => (
                        <Button 
                            key={index} 
                            type="link"
                            redirectTo={link[1]}
                        >{link[0]}</Button>
                    ))
                }
                <Connect />
            </section>
        </nav>
    )
}