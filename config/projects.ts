export interface ProjectConfig {
    description: string
    summary: string
    name: string
    href: string
    imageSrc: string
}
export const projectsConfig : ProjectConfig[] = [
    {
        name: "Game Stat Simulators",
        summary: "Lit JS website for caulcating stat increases.",
        description: `This website will help you calculate how many games you need to play in order to increase your stats by
any amount. It uses simple maths to calculate your expected average and also simulates matches until
your stats are reached. The simulations are entirely based on the stats you provide as input.
Game Stat Simulators was build using Lit JS and Vaadin components.`,
        href: 'https://game-stat-simulators.rotios.com/',
        imageSrc: '/GSSLogo.jpeg'
    },
    {
        name: "Minesweeper",
        summary: "React Minesweeper component with solver.",
        description: `A project from a previous react website ported over to NextUI.
            This minesweeper project includes buttons to help you solve the minesweeper puzzle.
            The layout is 10x10 and includes 12 mines. Can you find them all?
        `,
        href: '/projects/minesweeper',
        imageSrc: '/minesweeper_detector.jpeg'
    },
    {
        name: "The Adventures of Fat Tone",
        summary: "Roguelike game using Rot.JS!",
        description: `A short Roguelike game written with the Rot.JS library. In conjunction with John Freeman - https://www.github.com/jcf1.`,
    href: 'https://rotios.github.io/The-Adventures-of-Fat-Tone/',
    imageSrc: '/TAOFT.jpeg'
    }
]