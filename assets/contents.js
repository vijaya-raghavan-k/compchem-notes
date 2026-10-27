/* ==========================================================================
   THE HESSIAN NOTEBOOK — table of contents
   This is the only file to edit when a lesson is added or renamed.

   To publish a lesson:
     1. Copy lessons/_template.html to lessons/<slug>.html and write it.
     2. Below, give that topic   href: "lessons/<slug>.html"
     3. Commit and push.
   Topics without an href are listed as "coming later".
   Add, remove or reorder freely: numbering is generated from the order.
   ========================================================================== */

window.NOTEBOOK = {
  parts: [
    {
      title: "Mathematical foundations",
      intro: "The language behind geometry optimization, frequencies and transition states.",
      topics: [
        { t: "Coordinates and displacement vectors", d: "Where an atom is, and how far and in which direction it moved.", href: "lessons/coordinates-displacement.html" },
        { t: "Vector length, addition and the dot product", d: "Magnitudes, combining moves, and measuring how aligned two directions are.", href: "lessons/vectors-dot-product.html" },
        { t: "Functions of many variables", d: "Energy as one number computed from all atomic coordinates, E(R).", href: "lessons/functions-many-variables.html" },
        { t: "Derivatives and partial derivatives", d: "How the energy changes when one coordinate changes.", href: "lessons/derivatives.html" },
        { t: "Gradients and forces", d: "Collecting slopes into a vector, and why F = −∇E.", href: "lessons/gradients-forces.html" },
        { t: "Second derivatives and curvature", d: "Why a zero gradient can be a minimum, a maximum or a saddle.", href: "lessons/curvature.html" },
        { t: "Taylor expansion and the quadratic model", d: "Approximating a surface locally, and where the harmonic picture comes from.", href: "lessons/taylor-quadratic.html" },
        { t: "Matrices and matrix–vector products", d: "How the Hessian stores second derivatives and acts on a displacement.", href: "lessons/matrices.html" },
        { t: "Eigenvalues and eigenvectors", d: "Special directions of a matrix, and what Hv = λv means.", href: "lessons/eigenvectors.html" },
        { t: "Mass weighting and normal modes", d: "How masses and curvatures give vibrational frequencies.", href: "lessons/normal-modes.html" },
        { t: "Imaginary frequencies and transition states", d: "Negative curvature, saddle points and reading a frequency output.", href: "lessons/imaginary-frequencies.html" },
      ],
    },
    {
      title: "Moving on the potential energy surface",
      intro: "How programs search a surface for minima, saddles and paths.",
      topics: [
        { t: "Geometry optimization algorithms", d: "Steepest descent, conjugate gradient, Newton–Raphson and BFGS.", href: "lessons/optimization-algorithms.html" },
        { t: "Convergence criteria", d: "Energy, gradient and step thresholds, and why all of them matter.", href: "lessons/convergence-criteria.html" },
        { t: "Coordinate systems", d: "Cartesian, Z-matrix and internal coordinates.", href: "lessons/coordinate-systems.html" },
        { t: "Finding transition states", d: "Eigenvector following, synchronous transit and NEB.", href: "lessons/transition-state-search.html" },
        { t: "Intrinsic reaction coordinate", d: "Following the steepest-descent path from a saddle.", href: "lessons/irc.html" },
        { t: "Thermochemistry from frequencies", d: "Zero-point energy, partition functions, H, S and G.", href: "lessons/thermochemistry.html" },
        { t: "Transition state theory and kinetics", d: "From a barrier to a rate constant.", href: "lessons/tst-kinetics.html" },
      ],
    },
    {
      title: "Electronic structure",
      intro: "What actually computes the energy at each geometry.",
      topics: [
        { t: "The Schrödinger equation and Born–Oppenheimer", d: "Why a potential energy surface exists at all." },
        { t: "Orbitals and basis sets", d: "LCAO, Slater and Gaussian functions, DZ, TZP and beyond." },
        { t: "Hartree–Fock and the SCF cycle", d: "The Fock matrix and self-consistency." },
        { t: "SCF convergence", d: "Mixing, DIIS, damping, level shifting and smearing." },
        { t: "Electron correlation", d: "What Hartree–Fock misses; static and dynamic correlation." },
        { t: "Density functional theory", d: "Hohenberg–Kohn, Kohn–Sham and the exchange–correlation functional." },
        { t: "Functionals", d: "From LDA to range-separated hybrids, and self-interaction error." },
        { t: "Dispersion corrections", d: "D3, Becke–Johnson damping and D4." },
        { t: "Numerical precision", d: "Integration grids, numerical noise and basis set superposition error." },
        { t: "Spin and open-shell systems", d: "Unrestricted calculations, spin contamination and radicals." },
        { t: "Semi-empirical methods and DFTB", d: "Tight-binding approximations and when to trust them." },
      ],
    },
    {
      title: "Analyzing the electron density",
      intro: "Extracting chemical meaning from a computed density.",
      topics: [
        { t: "Population analysis and charges", d: "Mulliken, Hirshfeld, Voronoi and CM5." },
        { t: "QTAIM: topology of the density", d: "Critical points, bond paths and atomic basins." },
        { t: "QTAIM: characterizing bonds", d: "Density, Laplacian and energy densities at bond critical points." },
        { t: "Non-covalent interactions", d: "NCI plots and the electron localization function." },
        { t: "Conceptual DFT", d: "Chemical potential, hardness, electrophilicity and Fukui functions." },
        { t: "Energy decomposition analysis", d: "Pauli, electrostatic and orbital terms; activation strain." },
      ],
    },
    {
      title: "Molecular dynamics",
      intro: "Moving atoms in time and computing averages.",
      topics: [
        { t: "Equations of motion and integrators", d: "Verlet, timesteps and energy conservation." },
        { t: "Force fields", d: "Bonded and non-bonded terms, cutoffs and Ewald sums." },
        { t: "Statistical mechanics for MD", d: "Ensembles, the Boltzmann distribution and ergodicity." },
        { t: "Thermostats and NVT", d: "Berendsen, Nosé–Hoover, Langevin and velocity rescaling." },
        { t: "Barostats and NPT", d: "Pressure, the virial and density equilibration." },
        { t: "Ab initio and DFTB molecular dynamics", d: "Computing forces from electronic structure at every step." },
        { t: "Analyzing trajectories", d: "Radial distributions, diffusion and spectra from autocorrelation." },
        { t: "Enhanced sampling and free energy", d: "Collective variables, umbrella sampling and metadynamics." },
      ],
    },
    {
      title: "Multiscale methods and polymers",
      intro: "Treating different parts of a system at different levels.",
      topics: [
        { t: "QM/MM", d: "Partitioning, embedding and link atoms." },
        { t: "QM/QM′ and ONIOM", d: "Layered methods and the subtractive scheme." },
        { t: "Modeling polymers", d: "Oligomer models, chain-length convergence and periodic cells." },
      ],
    },
    {
      title: "Machine learning for chemistry",
      intro: "Learning properties and potentials from data.",
      topics: [
        { t: "Learning from data", d: "Loss functions, gradient descent and overfitting." },
        { t: "Molecular representations", d: "Descriptors, fingerprints, SMILES and BigSMILES." },
        { t: "Neural networks and backpropagation", d: "Backpropagation as the chain rule." },
        { t: "Graph neural networks", d: "Molecules as graphs and message passing." },
        { t: "Polymer property prediction", d: "Small datasets, repeat-unit graphs and uncertainty." },
        { t: "Machine-learned potentials", d: "Learning energies and forces, then running MD." },
      ],
    },
  ],
};
