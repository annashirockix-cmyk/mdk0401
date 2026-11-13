/* Browser-listening practice catalogue: Course 4 and Course 5.
 * This page is practice-only. It does not save grades or create exam attempts.
 */
(function () {
  "use strict";
  if (window.EnglishListeningCatalogue) return;

  var activities = [
    {
      id: "en-c04-s01-l01",
      title: "Course 4 · Semester 1 · Lesson 1 — Conductors, Semiconductors and Insulators",
      level: "B1+–B2",
      script: "In an electrical system, materials behave differently when an electric charge is applied. Conductors, such as copper and aluminium, allow current to flow relatively easily. Insulators, such as rubber and many plastics, resist the flow of current and are used to protect conductors. Semiconductors, including silicon, have electrical properties between those of conductors and insulators. Their behaviour can be controlled and they are essential in electronic devices. When discussing aircraft electrical equipment, it is important to distinguish the function of a conductor, an insulator and a semiconductor. This is a general materials lesson, not a procedure for working on aircraft wiring.",
      questions: [
        { prompt: "Which materials allow current to flow relatively easily?", options: ["Conductors", "Insulators", "Ceramics only", "Adhesives"], answerIndex: 0, explanation: "Conductors allow current to flow relatively easily." },
        { prompt: "What is the purpose of an insulator?", options: ["To resist current flow and protect conductors", "To increase current without limit", "To store mechanical energy", "To measure frequency"], answerIndex: 0, explanation: "Insulators resist current flow and provide protection." },
        { prompt: "Which material is a common semiconductor?", options: ["Silicon", "Rubber", "Copper cable", "Dry wood"], answerIndex: 0, explanation: "Silicon is identified as a semiconductor." },
        { prompt: "What is the main topic of the lesson?", options: ["Different electrical properties of materials", "Aircraft navigation procedures", "CNC tool selection", "Network topology"], answerIndex: 0, explanation: "The recording compares conductors, insulators and semiconductors." }
      ]
    },
    {
      id: "en-c04-s01-l02",
      title: "Course 4 · Semester 1 · Lesson 2 — Direct Current, Alternating Current and Units",
      level: "B1+–B2",
      script: "A technician is reading a classroom information sheet about electrical quantities. The sheet explains that direct current flows in one direction, while alternating current changes direction periodically. Voltage is measured in volts, current in amperes and resistance in ohms. Electrical power is measured in watts. Frequency describes how many cycles occur in one second and is measured in hertz. When reading a technical value, always pay attention to the unit as well as the number. A value without a unit may be unclear or misleading. These are basic definitions for language learning, not aircraft electrical limits or test values.",
      questions: [
        { prompt: "How does direct current flow?", options: ["In one direction", "It changes direction periodically", "It has no direction", "Only through air"], answerIndex: 0, explanation: "Direct current flows in one direction." },
        { prompt: "What is the unit of voltage?", options: ["Volt", "Ampere", "Ohm", "Watt"], answerIndex: 0, explanation: "Voltage is measured in volts." },
        { prompt: "What does frequency describe?", options: ["The number of cycles per second", "The amount of resistance", "The length of a cable", "The mass of a component"], answerIndex: 0, explanation: "Frequency is the number of cycles in one second." },
        { prompt: "Why is the unit important?", options: ["A number without a unit may be unclear", "Units are only decorative", "Units replace all measurements", "A unit identifies the operator"], answerIndex: 0, explanation: "The recording warns that values need units to be interpreted." }
      ]
    },
    {
      id: "en-c04-s01-l03",
      title: "Course 4 · Semester 1 · Lesson 3 — Basic Electrical Circuit Components",
      level: "B2",
      script: "A simple electrical circuit contains a source, conductors, a load and often a switch. The source provides electrical energy. Conductors create a path for current. The load converts electrical energy into another form, such as light, heat or mechanical movement. A switch opens or closes the circuit. When the path is complete, the circuit is closed and current can flow. When the path is interrupted, the circuit is open. A fuse is a protective device designed to interrupt a circuit if the current becomes too high. In this classroom example, students identify each component on a simplified diagram. They do not connect or test real equipment.",
      questions: [
        { prompt: "What does the source provide?", options: ["Electrical energy", "A mechanical drawing", "A data backup", "A network address"], answerIndex: 0, explanation: "The source provides electrical energy." },
        { prompt: "What does a load do?", options: ["Converts electrical energy into another form", "Always measures frequency", "Stores document revisions", "Connects computers to a WAN"], answerIndex: 0, explanation: "A load converts electrical energy into another form." },
        { prompt: "When is a circuit closed?", options: ["When the path is complete", "When a conductor is removed", "When the source is missing", "When the diagram is printed"], answerIndex: 0, explanation: "A closed circuit has a complete path." },
        { prompt: "What is the purpose of a fuse?", options: ["To interrupt a circuit if current becomes too high", "To increase voltage indefinitely", "To store energy for months", "To convert light into sound"], answerIndex: 0, explanation: "A fuse is a protective device that interrupts excessive current." }
      ]
    },
    {
      id: "en-c04-s01-l04",
      title: "Course 4 · Semester 1 · Lesson 4 — Series and Parallel Circuits",
      level: "B2",
      script: "An instructor compares two simplified circuit diagrams. In a series circuit, components are connected along one path. If one component interrupts that path, the whole circuit may stop operating. In a parallel circuit, components are connected on separate branches. If one branch is interrupted, current may still flow through the other branches. This is why parallel connections are common in many electrical installations. The instructor asks the students to describe the difference using the words branch, path, current and component. The diagrams are classroom examples. They do not represent a specific aircraft electrical network or provide instructions for modifying a circuit.",
      questions: [
        { prompt: "How many paths are there in a simple series circuit?", options: ["One", "Two", "Three", "No path"], answerIndex: 0, explanation: "A series circuit has one path." },
        { prompt: "What happens if the single path is interrupted?", options: ["The whole circuit may stop operating", "All branches continue independently", "The source changes type", "The voltage unit changes"], answerIndex: 0, explanation: "An interruption in the single path can stop the whole circuit." },
        { prompt: "What is a feature of a parallel circuit?", options: ["It has separate branches", "It has only one path", "It has no load", "It cannot contain a switch"], answerIndex: 0, explanation: "Parallel circuits have separate branches." },
        { prompt: "Which vocabulary is used in the comparison?", options: ["Branch, path, current and component", "Fuselage, wing, tail and cockpit", "Router, node, server and protocol", "Casting, forging, milling and grinding"], answerIndex: 0, explanation: "The instructor asks students to use four circuit terms." }
      ]
    },
    {
      id: "en-c04-s01-l05",
      title: "Course 4 · Semester 1 · Lesson 5 — Conventional Power Plants",
      level: "B1+–B2",
      script: "Conventional power plants generate electricity using different energy sources. In a thermal power station, fuel is used to produce heat. The heat creates steam, and the steam drives a turbine connected to a generator. Hydroelectric power stations use moving water to turn turbines. Nuclear power stations use heat from nuclear reactions to produce steam. Each type of plant has different operating principles, resource requirements and environmental considerations. When comparing energy sources, engineers may discuss efficiency, availability, emissions and cost. The figures in a classroom comparison table are simplified examples and should not be treated as current national energy statistics.",
      questions: [
        { prompt: "What drives a turbine in a thermal power station?", options: ["Steam", "A USB device", "A network signal", "A mouse pointer"], answerIndex: 0, explanation: "Steam drives the turbine in the described thermal plant." },
        { prompt: "What does a hydroelectric power station use?", options: ["Moving water", "A fuel cell only", "A computer fan", "A mobile phone battery"], answerIndex: 0, explanation: "Hydroelectric stations use moving water." },
        { prompt: "Which factors may be compared?", options: ["Efficiency, availability, emissions and cost", "Keyboard layout and screen size", "Document font and page count", "Cable colour and connector shape"], answerIndex: 0, explanation: "The speaker lists four comparison factors." },
        { prompt: "How should classroom figures be treated?", options: ["As simplified examples, not current national statistics", "As official live data", "As operating instructions", "As guaranteed forecasts"], answerIndex: 0, explanation: "The speaker explicitly limits the status of the figures." }
      ]
    },
    {
      id: "en-c04-s01-l06",
      title: "Course 4 · Semester 1 · Lesson 6 — Alternative Energy Sources",
      level: "B1+–B2",
      script: "Alternative energy sources include solar, wind, tidal and geothermal energy. Solar panels convert sunlight into electrical energy. Wind turbines use moving air to drive a generator. Tidal systems use the movement of sea water, while geothermal systems use heat from below the Earth's surface. Some renewable sources depend on weather or local geography, so energy storage and connection to the electricity network may be important. Engineers compare the available resource, environmental impact, reliability and cost. In this listening exercise, a student explains why a combination of energy sources may be useful for a training project. The discussion is conceptual and does not provide a site design.",
      questions: [
        { prompt: "What do solar panels convert?", options: ["Sunlight into electrical energy", "Wind into steam", "Water into plastic", "Sound into mechanical force"], answerIndex: 0, explanation: "Solar panels convert sunlight into electrical energy." },
        { prompt: "What drives a wind turbine?", options: ["Moving air", "Underground heat", "Tidal water only", "A computer program"], answerIndex: 0, explanation: "Moving air drives a wind turbine." },
        { prompt: "Why may energy storage be important?", options: ["Some renewable sources depend on weather or local geography", "All renewable sources are constant", "Storage changes the unit of voltage", "It replaces every generator"], answerIndex: 0, explanation: "Availability may vary with weather and location." },
        { prompt: "What is the status of the discussion?", options: ["A conceptual classroom exercise", "A certified site design", "A live power-grid instruction", "A maintenance authorization"], answerIndex: 0, explanation: "The speaker says it is conceptual and not a site design." }
      ]
    },
    {
      id: "en-c04-s01-l07",
      title: "Course 4 · Semester 1 · Lesson 7 — Inventions in Electronics",
      level: "B2",
      script: "The development of electronics has changed communication, computing, transport and manufacturing. The transistor made it possible to build smaller and more efficient electronic circuits. Integrated circuits placed many electronic components on a small piece of semiconductor material. Microprocessors brought processing functions into compact devices. Later developments in sensors and digital communication allowed systems to collect and exchange more information. These inventions developed through research, testing and improvements in materials and manufacturing. In a short presentation, a student should describe the invention, explain the problem it addressed and give an example of its impact without claiming that one invention changed every industry in the same way.",
      questions: [
        { prompt: "What did the transistor make possible?", options: ["Smaller and more efficient electronic circuits", "The end of all electrical systems", "A replacement for every sensor", "A new type of mechanical turbine"], answerIndex: 0, explanation: "The transistor supported smaller and more efficient circuits." },
        { prompt: "What do integrated circuits contain?", options: ["Many electronic components on a small semiconductor piece", "Only mechanical gears", "A complete power station", "A set of paper instructions"], answerIndex: 0, explanation: "Integrated circuits place many components on a small semiconductor substrate." },
        { prompt: "How did these inventions develop?", options: ["Through research, testing and improvements", "All at the same time", "Without materials research", "Only through advertising"], answerIndex: 0, explanation: "The speaker describes gradual development through research and testing." },
        { prompt: "What should a student avoid?", options: ["Claiming one invention changed every industry in the same way", "Explaining an invention's impact", "Giving an example", "Describing the problem addressed"], answerIndex: 0, explanation: "The speaker cautions against overgeneralization." }
      ]
    },
    {
      id: "en-c04-s01-l08",
      title: "Course 4 · Semester 1 · Lesson 8 — Electronic Circuits and Signal Processing",
      level: "B2",
      script: "Electronic circuits process electrical signals. A resistor limits or controls current in a circuit, a capacitor stores electrical energy in an electric field, and a diode allows current to pass more easily in one direction than the other. Transistors can be used as switches or amplifying devices. Some circuits process analogue signals, which vary continuously. Other circuits process digital signals, which use discrete values. In a simplified sensor example, an analogue signal is converted into digital data so that a computer can process and display it. The example explains general concepts only; it does not describe a particular aircraft circuit.",
      questions: [
        { prompt: "What can a resistor do?", options: ["Limit or control current", "Store a document revision", "Generate radio waves by itself", "Measure distance without a sensor"], answerIndex: 0, explanation: "A resistor can limit or control current." },
        { prompt: "What does a diode do?", options: ["Allows current to pass more easily in one direction", "Stores data permanently", "Converts every signal into sound", "Connects a computer to the internet"], answerIndex: 0, explanation: "The diode is described as conducting more easily in one direction." },
        { prompt: "How do analogue signals vary?", options: ["Continuously", "Only as letters", "Only as fixed text labels", "Not at all"], answerIndex: 0, explanation: "Analogue signals vary continuously." },
        { prompt: "What happens in the sensor example?", options: ["An analogue signal is converted into digital data", "A digital file becomes a turbine", "A resistor becomes a sensor", "A drawing becomes a circuit"], answerIndex: 0, explanation: "The example describes analogue-to-digital conversion." }
      ]
    },
    {
      id: "en-c04-s01-l09",
      title: "Course 4 · Semester 1 · Lesson 9 — Mobile Phones and Wireless Communication",
      level: "B1+–B2",
      script: "A mobile phone is a portable communication device. It can send and receive voice, text and data through a wireless network. The device contains a processor, memory, battery, display, antenna and radio components. A mobile network uses base stations to provide coverage over an area. When a user moves, the network can transfer the connection between cells. Wireless communication is useful, but performance may be affected by signal strength, obstacles, interference and network capacity. In a technical workplace, personal devices must be used according to local information-security rules. Do not photograph or share controlled technical information unless you are authorized to do so.",
      questions: [
        { prompt: "What can a mobile phone send and receive?", options: ["Voice, text and data", "Only printed drawings", "Only electrical current", "Only analogue measurements"], answerIndex: 0, explanation: "The phone sends and receives voice, text and data." },
        { prompt: "What does a mobile network use to provide coverage?", options: ["Base stations", "Circuit fuses", "CNC axes", "Hydraulic pumps"], answerIndex: 0, explanation: "Base stations provide network coverage." },
        { prompt: "What may affect wireless performance?", options: ["Signal strength, obstacles, interference and capacity", "The colour of the device", "The font in a report", "The number of pages in a manual"], answerIndex: 0, explanation: "The speaker lists four factors." },
        { prompt: "What should users follow in a technical workplace?", options: ["Local information-security rules", "Personal preference only", "Unverified online advice", "No restrictions"], answerIndex: 0, explanation: "The speaker stresses local information-security rules." }
      ]
    },
    {
      id: "en-c04-s01-l10",
      title: "Course 4 · Semester 1 · Lesson 10 — Aircraft Electrical Power: Sources and Distribution",
      level: "B2",
      script: "This classroom briefing introduces the vocabulary of aircraft electrical power. An aircraft may have more than one source of electrical energy, and the distribution system supplies different groups of equipment. A technical overview may refer to generators, batteries, buses, converters and protective devices. A bus is a distribution path that supplies electrical power to connected loads. The system description explains how power sources and loads are represented in approved documentation. Different aircraft designs may use different arrangements, so students must not assume that one simplified diagram applies to every aircraft. This lesson teaches terminology and relationships, not how to operate or isolate a real electrical system.",
      questions: [
        { prompt: "What is the focus of the briefing?", options: ["Vocabulary for aircraft electrical power", "A live aircraft power test", "A repair procedure", "A passenger service announcement"], answerIndex: 0, explanation: "The speaker introduces the vocabulary of electrical power systems." },
        { prompt: "What is a bus in this context?", options: ["A distribution path supplying connected loads", "A passenger vehicle", "A battery chemistry", "A network password"], answerIndex: 0, explanation: "A bus is a power distribution path." },
        { prompt: "Why should students avoid assuming one diagram fits every aircraft?", options: ["Aircraft designs may use different arrangements", "All aircraft use identical systems", "Diagrams never contain symbols", "A bus is always a computer"], answerIndex: 0, explanation: "The speaker notes that designs differ." },
        { prompt: "What is the lesson intended to teach?", options: ["Identify terms and describe relationships", "Operate or isolate a real system", "Approve maintenance work", "Select live electrical settings"], answerIndex: 0, explanation: "The lesson is language and conceptual learning only." }
      ]
    },
    {
      id: "en-c04-s01-l11",
      title: "Course 4 · Semester 1 · Lesson 11 — Wiring Diagrams, Connectors, Bonding and Grounding",
      level: "B2",
      script: "A wiring diagram shows how electrical components and connections are represented in a system. It may identify wires, connectors, terminals, reference numbers and symbols. A connector joins conductors and allows a connection to be made or separated in a controlled design. Bonding and grounding are terms used to describe electrical connections intended to manage potential differences and provide defined reference paths. In a technical document, the symbol, wire identification and connector reference must be read together. A training diagram can help students practise describing connections, but it is not a work instruction. Real aircraft wiring tasks require current approved data, appropriate authorization and the organization's procedures.",
      questions: [
        { prompt: "What does a wiring diagram show?", options: ["Representations of components and electrical connections", "A passenger seating plan", "A list of software passwords", "A manufacturing timetable"], answerIndex: 0, explanation: "A wiring diagram represents components and connections." },
        { prompt: "What does a connector do?", options: ["Joins conductors", "Measures temperature", "Stores a program", "Generates mechanical movement"], answerIndex: 0, explanation: "A connector joins conductors." },
        { prompt: "What must be read together?", options: ["Symbol, wire identification and connector reference", "Only the page colour", "Only the document title", "Only the author's name"], answerIndex: 0, explanation: "The briefing names all three pieces of information." },
        { prompt: "What is required for real aircraft wiring tasks?", options: ["Current approved data, authorization and procedures", "A training diagram alone", "An informal online comment", "A guess based on a similar aircraft"], answerIndex: 0, explanation: "The speaker lists approved data, authorization and procedures." }
      ]
    },
    {
      id: "en-c04-s01-l12",
      title: "Course 4 · Semester 1 · Lesson 12 — Electrical Measurements and Describing a Fault",
      level: "B2",
      script: "When describing an electrical measurement, include the quantity, the value, the unit, the source and the conditions stated in the record. For example, a classroom report might say: ‘The training table lists a voltage value of twelve volts for sample point B.’ The report should distinguish the recorded value from an interpretation. If a field is missing or two records disagree, describe the discrepancy and identify what needs confirmation. Do not invent a measurement or diagnose a failed component without sufficient evidence. Clear professional communication helps another person understand what was observed, what remains unknown and what information is required next.",
      questions: [
        { prompt: "What should a measurement description include?", options: ["Quantity, value, unit, source and stated conditions", "Only a number", "Only the student's name", "A suggested repair"], answerIndex: 0, explanation: "The speaker lists five elements for a clear measurement record." },
        { prompt: "What should a report do when records disagree?", options: ["Describe the discrepancy and identify what needs confirmation", "Choose a value at random", "Delete the source", "Invent a new measurement"], answerIndex: 0, explanation: "The discrepancy should be reported without guessing." },
        { prompt: "What should be distinguished?", options: ["The recorded value and the interpretation", "The title and page colour", "The student and teacher", "The date and room number"], answerIndex: 0, explanation: "The speaker separates observation from interpretation." },
        { prompt: "What is the goal of clear professional communication?", options: ["Explain observations, unknowns and required next information", "Hide uncertainty", "Make an unsupported diagnosis", "Replace technical records"], answerIndex: 0, explanation: "The report should make evidence and remaining questions clear." }
      ]
    },
    {
      id: "en-c04-s02-l01",
      title: "Course 4 · Semester 2 · Lesson 1 — Means of Transmission",
      level: "B1+–B2",
      script: "In a technical communication system, information can be transmitted in different ways. A wired connection uses a physical cable. A wireless connection sends information through radio waves or another wireless signal. Fibre-optic communication uses light travelling through a thin glass or plastic fibre. Each method has advantages and limitations. A cable can provide a stable connection, but it may require physical installation. Wireless communication can support mobility, but signal quality may be affected by distance or interference. Fibre optics can carry large amounts of data over long distances. In an aircraft-related training example, engineers may discuss communication links between equipment, but the exact design must always be taken from approved system documentation.",
      questions: [
        { prompt: "What are the three transmission methods mentioned?", options: ["Wired, wireless and fibre-optic", "Digital, mechanical and hydraulic", "Local, national and international", "Manual, automatic and visual"], answerIndex: 0, explanation: "The briefing describes wired, wireless and fibre-optic communication." },
        { prompt: "What does a wired connection use?", options: ["A physical cable", "Only light", "A printed chart", "A mechanical lever"], answerIndex: 0, explanation: "A wired connection uses a physical cable." },
        { prompt: "What may affect wireless signal quality?", options: ["Distance or interference", "The colour of a cable", "The size of a printed manual", "The revision letter"], answerIndex: 0, explanation: "The speaker identifies distance and interference." },
        { prompt: "Where should engineers find exact system design information?", options: ["Approved system documentation", "An informal guess", "A social media post", "An unrelated classroom worksheet"], answerIndex: 0, explanation: "The speaker says exact design information must come from approved documentation." }
      ]
    },
    {
      id: "en-c04-s02-l02",
      title: "Course 4 · Semester 2 · Lesson 2 — Networks and Topologies",
      level: "B1+–B2",
      script: "A computer network connects devices so that they can exchange information. In a star topology, each device is connected to a central point. In a bus topology, devices share a common communication line. In a ring topology, each device is connected to two neighbouring devices, forming a closed path. A mesh topology provides several possible connections between devices. The choice of topology depends on the system requirements, including reliability, cost, complexity and the amount of data. This classroom diagram uses four computers and a central switch to illustrate a star network. It is a simplified learning model, not a description of an aircraft network.",
      questions: [
        { prompt: "What does a computer network allow devices to do?", options: ["Exchange information", "Change their physical size", "Produce electricity", "Measure temperature directly"], answerIndex: 0, explanation: "A network connects devices so they can exchange information." },
        { prompt: "Which topology uses a central point?", options: ["Star", "Ring", "Bus", "Mesh"], answerIndex: 0, explanation: "In a star topology, devices connect to a central point." },
        { prompt: "How are devices connected in a ring topology?", options: ["To two neighbouring devices in a closed path", "Only to one central switch", "To a single shared cable with no branches", "Without any connection"], answerIndex: 0, explanation: "A ring connects each device to two neighbours." },
        { prompt: "Which factors influence topology selection?", options: ["Reliability, cost, complexity and data volume", "Device colour only", "The operator's age", "The room number"], answerIndex: 0, explanation: "The speaker lists system and resource requirements." }
      ]
    },
    {
      id: "en-c04-s02-l03",
      title: "Course 4 · Semester 2 · Lesson 3 — Computer Hardware and Software",
      level: "B1+–B2",
      script: "A computer system consists of hardware and software. Hardware means the physical components, such as the processor, memory, storage devices, keyboard and display. Software is the set of programs and instructions that tell the hardware what to do. The operating system manages the computer's resources and provides an environment for applications. An application is designed for a particular task, such as editing a document or analysing a training dataset. In an engineering office, a workstation may be used to read drawings, review records or prepare reports. The computer itself does not guarantee that the information is correct: users must check the source, version and context of the data.",
      questions: [
        { prompt: "What is hardware?", options: ["The physical components of a computer", "A set of written instructions only", "An internet connection", "A type of network topology"], answerIndex: 0, explanation: "Hardware refers to physical computer components." },
        { prompt: "What does software include?", options: ["Programs and instructions", "Only cables and connectors", "The monitor casing", "A printed circuit board only"], answerIndex: 0, explanation: "Software is the set of programs and instructions." },
        { prompt: "What does an operating system do?", options: ["Manages computer resources", "Manufactures the processor", "Measures electrical current", "Replaces every application"], answerIndex: 0, explanation: "The operating system manages resources and supports applications." },
        { prompt: "What must users check when reviewing data?", options: ["Source, version and context", "Screen brightness only", "Keyboard layout only", "The colour of the computer"], answerIndex: 0, explanation: "The speaker emphasizes checking the source, version and context." }
      ]
    },
    {
      id: "en-c04-s02-l04",
      title: "Course 4 · Semester 2 · Lesson 4 — USB Storage and Types of Computers",
      level: "B1+–B2",
      script: "Computers are designed for different purposes. A desktop computer is usually installed in one place. A laptop is portable and has a built-in screen and keyboard. A tablet is a lightweight mobile device with a touch screen. A server provides services or resources to other computers on a network. Removable storage devices, such as USB flash drives, can be used to transfer files. However, removable media may introduce security risks if its origin is unknown. In this classroom scenario, a student receives a USB drive from an unidentified source. The correct response is not to open files automatically. The student should follow the college's approved procedure and ask the responsible teacher or IT staff for guidance.",
      questions: [
        { prompt: "Which computer is designed to be portable?", options: ["Laptop", "Desktop", "Server rack", "Mainframe cabinet"], answerIndex: 0, explanation: "A laptop is described as portable." },
        { prompt: "What does a server provide?", options: ["Services or resources to other computers", "A touch screen for every user", "A mechanical drive system", "A paper drawing"], answerIndex: 0, explanation: "A server provides network services or resources." },
        { prompt: "What is one risk of removable media?", options: ["Files may come from an unknown or unsafe source", "It always improves network speed", "It cannot store information", "It changes the screen resolution"], answerIndex: 0, explanation: "The speaker warns about removable media from unknown sources." },
        { prompt: "What should the student do with an unidentified USB drive?", options: ["Follow the college procedure and ask responsible staff", "Open every file immediately", "Copy it to a personal device", "Ignore all security rules"], answerIndex: 0, explanation: "The recommended action is to use the approved local procedure." }
      ]
    },
    {
      id: "en-c04-s02-l05",
      title: "Course 4 · Semester 2 · Lesson 5 — The Internet and Technical Information Sources",
      level: "B1+–B2",
      script: "The internet provides access to a large amount of technical information. Engineers and students may use online catalogues, digital libraries, manufacturer websites and educational resources. However, not every page is reliable or current. Before using information, check who published it, when it was updated, what document or product it refers to and whether the source is authoritative for the task. A forum post may help you understand a common question, but it should not replace an approved technical document. In this exercise, two websites give different descriptions of the same training component. The student records both references and checks the supplied course materials before deciding which description is relevant.",
      questions: [
        { prompt: "What sources are mentioned?", options: ["Online catalogues, digital libraries, manufacturer sites and educational resources", "Only private messages", "Only social networks", "Only printed advertisements"], answerIndex: 0, explanation: "The speaker lists several types of online information sources." },
        { prompt: "What should a user check before relying on a webpage?", options: ["Publisher, update date, reference and authority", "Font size only", "Number of pictures only", "The colour of the logo"], answerIndex: 0, explanation: "The briefing lists publisher, date, reference and authority." },
        { prompt: "What should a forum post not replace?", options: ["An approved technical document", "A personal diary", "A timetable", "A classroom seating plan"], answerIndex: 0, explanation: "A forum post is not a substitute for an approved technical document." },
        { prompt: "What does the student do when two websites disagree?", options: ["Records both references and checks course materials", "Chooses the first result automatically", "Deletes both references", "Invents a third description"], answerIndex: 0, explanation: "The student records both sources and checks the course materials." }
      ]
    },
    {
      id: "en-c04-s02-l06",
      title: "Course 4 · Semester 2 · Lesson 6 — Automation and Robotics",
      level: "B2",
      script: "Automation uses control systems to perform tasks with limited direct human intervention. A robot is a programmable machine that can carry out a range of movements or operations. In manufacturing, robots may support material handling, welding, painting or inspection tasks. Automated systems can improve consistency and repeatability, but they also require planning, monitoring and appropriate safeguards. A human operator remains responsible for following the local procedures and responding to abnormal conditions. In our classroom case, a diagram shows a robot arm moving a training part between two marked positions. The diagram illustrates a sequence of programmed actions; it does not provide instructions for operating real equipment.",
      questions: [
        { prompt: "What is automation?", options: ["Using control systems to perform tasks with limited direct intervention", "A method of drawing by hand", "A type of storage device", "A process of translating documents"], answerIndex: 0, explanation: "The speaker defines automation in terms of controlled task execution." },
        { prompt: "Which task may a manufacturing robot perform?", options: ["Material handling", "Writing a personal email", "Approving a document revision", "Teaching a language class"], answerIndex: 0, explanation: "Material handling is one of the listed examples." },
        { prompt: "What do automated systems still require?", options: ["Planning, monitoring and safeguards", "No human oversight", "No documentation", "No maintenance planning"], answerIndex: 0, explanation: "The briefing stresses planning, monitoring and safeguards." },
        { prompt: "What does the classroom diagram illustrate?", options: ["A sequence of programmed robot movements", "A real operating procedure", "An aircraft flight path", "A network security policy"], answerIndex: 0, explanation: "The diagram is a learning model of a programmed sequence." }
      ]
    },
    {
      id: "en-c04-s02-l07",
      title: "Course 4 · Semester 2 · Lesson 7 — Sensors and Measurement Data",
      level: "B2",
      script: "A sensor detects a physical condition and produces a signal that can be used by an electronic system. Different sensors are designed to measure different quantities. A temperature sensor responds to temperature, a pressure sensor measures pressure, and a proximity sensor detects the presence of an object nearby. The signal may be converted into digital data and displayed or stored. When engineers review sensor information, they consider the measurement range, units, timestamp and source. A missing value or an unusual reading should be described carefully. It may require further investigation, but one reading alone does not always identify the cause of a problem.",
      questions: [
        { prompt: "What does a sensor do?", options: ["Detects a physical condition and produces a signal", "Stores every document revision", "Controls all network users", "Creates a technical drawing"], answerIndex: 0, explanation: "A sensor detects a condition and produces a signal." },
        { prompt: "Which sensor detects the presence of a nearby object?", options: ["Proximity sensor", "Temperature sensor", "Pressure sensor", "Light bulb"], answerIndex: 0, explanation: "A proximity sensor detects an object nearby." },
        { prompt: "What should engineers consider when reviewing sensor data?", options: ["Range, units, timestamp and source", "Colour and font only", "The room temperature only", "The computer brand"], answerIndex: 0, explanation: "The speaker lists four important data details." },
        { prompt: "Does one unusual reading always identify the cause?", options: ["Yes", "No"], answerIndex: 1, explanation: "The speaker says one reading alone may not identify the cause." }
      ]
    },
    {
      id: "en-c04-s02-l08",
      title: "Course 4 · Semester 2 · Lesson 8 — Human–Computer Interaction and Input Devices",
      level: "B1+–B2",
      script: "A human–computer interface allows a person to interact with a digital system. Common input devices include a keyboard, mouse, touch screen, scanner and microphone. A mouse usually controls a pointer on the screen. The user can move the pointer, select an item, open a menu or drag an object. In a technical office, an input device may be used to navigate a drawing, enter a search term or review a digital record. Good interface design should make actions clear and reduce the risk of accidental selection. In this classroom task, students compare two interface layouts and explain which one is easier to use and why.",
      questions: [
        { prompt: "What is a human–computer interface?", options: ["A way for a person to interact with a digital system", "A type of aircraft structure", "A material testing method", "A network cable"], answerIndex: 0, explanation: "The interface enables interaction between a person and a digital system." },
        { prompt: "What does a mouse usually control?", options: ["A pointer on the screen", "The room temperature", "The network voltage", "A robot's power supply"], answerIndex: 0, explanation: "A mouse controls a pointer on the screen." },
        { prompt: "Which action can a user perform with a mouse?", options: ["Select an item or open a menu", "Measure pressure directly", "Transmit radio signals", "Change a material's properties"], answerIndex: 0, explanation: "The speaker lists selecting items and opening menus." },
        { prompt: "What should good interface design do?", options: ["Make actions clear and reduce accidental selection", "Hide all controls", "Use as many menus as possible", "Remove user feedback"], answerIndex: 0, explanation: "The speaker describes clarity and reduced accidental selection." }
      ]
    },
    {
      id: "en-c04-s02-l09",
      title: "Course 4 · Semester 2 · Lesson 9 — Avionics Overview: Systems and Information Exchange",
      level: "B1+–B2",
      script: "Let us look at a simplified avionics information chain. First, a sensor provides information about a particular condition. The signal is received by an electronic unit. The processing unit checks the incoming data and prepares information for another part of the system. Depending on the system design, the result may be shown on a display, stored in a record or shared through an approved data interface. Engineers use system descriptions to understand the relationship between inputs, processing and outputs. Remember that this is a classroom model. Real aircraft systems are more complex, and all maintenance or operational work must follow the current approved documentation and the person’s authorization.",
      questions: [
        { prompt: "What is the briefing about?", options: ["A simplified avionics information chain", "A passenger boarding process", "A real aircraft repair", "A CNC machining cycle"], answerIndex: 0, explanation: "The speaker describes a high-level classroom model of information flow." },
        { prompt: "What provides information first?", options: ["A sensor", "A display", "A report", "A printer"], answerIndex: 0, explanation: "The chain begins when a sensor provides information." },
        { prompt: "What does the processing unit do?", options: ["Checks incoming data", "Repairs the sensor", "Approves maintenance", "Changes the aircraft configuration"], answerIndex: 0, explanation: "The processing unit checks incoming data." },
        { prompt: "Where may the result appear?", options: ["On a display or in a record", "Only in a paper manual", "Only in a passenger list", "In a workshop timetable"], answerIndex: 0, explanation: "The result may be displayed, stored or shared through an approved interface." }
      ]
    },
    {
      id: "en-c04-s02-l10",
      title: "Course 4 · Semester 2 · Lesson 10 — Programming Logic, Flowcharts and Algorithms",
      level: "B2",
      script: "Our classroom example checks a data file. First, the program receives the file name and the file format. Next, it checks whether the format is on the approved list for this exercise. If the format is not valid, the program displays an error message and records the result as ‘not accepted’. If the format is valid, the program continues to the next training step. The same check is repeated for each file in the sample list. This is a simple algorithm for learning about sequence, selection and iteration. It is not aircraft software and must not be used as a real avionics program.",
      questions: [
        { prompt: "What does the classroom algorithm check?", options: ["A data file and its format", "An aircraft engine", "A passenger ticket", "A machine tool"], answerIndex: 0, explanation: "The example checks a data file and its format." },
        { prompt: "What happens if the format is invalid?", options: ["An error message is displayed", "The file is automatically approved", "The program deletes all records", "The program skips every check"], answerIndex: 0, explanation: "An invalid format produces an error message and a not-accepted result." },
        { prompt: "What happens when the format is valid?", options: ["The program continues to the next training step", "The program stops permanently", "The file is deleted", "A maintenance task begins"], answerIndex: 0, explanation: "The program continues to the next training step." },
        { prompt: "Which programming concepts does the example illustrate?", options: ["Sequence, selection and iteration", "Encryption, compression and printing", "Drawing, casting and forging", "Heating, cooling and cutting"], answerIndex: 0, explanation: "The script explicitly names sequence, selection and iteration." }
      ]
    },
    {
      id: "en-c04-s02-l11",
      title: "Course 4 · Semester 2 · Lesson 11 — Sensor Data, Validation and Diagnostic Logs",
      level: "B2",
      script: "We have reviewed five lines in the training log. Most records contain a timestamp and a sample value. Record A-03 has a missing value, so it cannot be included in the same comparison without a note. Record A-04 appears twice with the same timestamp and value. This may be a duplicate, but we should check the source file before removing anything. The available information does not prove a sensor fault. In the report, describe the missing field, identify the possible duplicate and state what evidence is still required. Keep observations separate from assumptions.",
      questions: [
        { prompt: "How many lines were reviewed?", options: ["Three", "Four", "Five", "Six"], answerIndex: 2, explanation: "The speaker says five lines were reviewed." },
        { prompt: "Which record has a missing value?", options: ["A-01", "A-02", "A-03", "A-04"], answerIndex: 2, explanation: "Record A-03 has a missing value." },
        { prompt: "What is unusual about A-04?", options: ["It appears twice with the same timestamp and value", "It has no timestamp", "It contains five different values", "It has been approved"], answerIndex: 0, explanation: "A-04 appears twice with the same timestamp and value." },
        { prompt: "Does the information prove a sensor fault?", options: ["Yes", "No"], answerIndex: 1, explanation: "The speaker says the available information does not prove a sensor fault." }
      ]
    },
    {
      id: "en-c04-s02-l12",
      title: "Course 4 · Semester 2 · Lesson 12 — Cybersecurity Vocabulary and Safe Data Handling",
      level: "B2",
      script: "I received an unexpected message that appears to come from a technical support team. It says that my account will be blocked unless I open an attachment and confirm my password. There are several warning signs: the request is urgent, the attachment was not expected, and the message asks for confidential information. I will not open the attachment or reply with my password. I will use the organization’s approved reporting channel and follow the local incident procedure. I will not send the message or any technical records to my personal account. The security team can review the report through the correct process. Follow-up handover: We checked the sample log and found one incomplete record. The document revision is shown in the header, but the source file still needs to be confirmed. We have not identified the cause of the missing field. Please keep the observation separate from any possible explanation. The next student team should compare the source record with the training copy, note the result and update the classroom report. Do not use this exercise as an operational instruction.",
      questions: [
        { prompt: "What does the unexpected message request?", options: ["Opening an attachment and confirming a password", "Booking a training room", "Updating a timetable", "Reading a public notice"], answerIndex: 0, explanation: "The message threatens to block the account unless the user opens an attachment and confirms a password." },
        { prompt: "Which is a warning sign?", options: ["Urgency and an unexpected attachment", "A familiar classroom schedule", "A normal public announcement", "A completed lesson"], answerIndex: 0, explanation: "Urgency and an unexpected attachment are identified as warning signs." },
        { prompt: "What should the recipient do?", options: ["Use the approved reporting channel", "Reply with the password", "Forward records to a personal account", "Open the attachment immediately"], answerIndex: 0, explanation: "The speaker recommends the organization's approved reporting channel." },
        { prompt: "What does the follow-up log review identify?", options: ["One incomplete record", "A confirmed sensor fault", "A completed maintenance task", "A production approval"], answerIndex: 0, explanation: "The handover says one record is incomplete." }
      ]
    },
    {
      id: "en-c05-s01-l01",
      title: "Lesson 1 — Materials in Mechanical Engineering",
      level: "B1+–B2",
      script: "Welcome to the materials briefing. Engineers select materials by considering their properties, cost and intended use. Common groups include metals, polymers, ceramics and composites. Metals can be classified as ferrous or non-ferrous. Steel is an iron-based alloy containing carbon. Aluminium alloys are widely used in the aircraft industry because they can offer a useful combination of properties. Copper is valued for its electrical conductivity, while PVC is commonly used to insulate wires and cables. Ceramics are hard and can provide electrical insulation, but they are often brittle. Composite materials combine two or more constituents to achieve a set of properties. The correct choice always depends on the design requirements and the approved material information.",
      questions: [
        { prompt: "What factors influence material selection?", options: ["Properties, cost and intended use", "Colour and packaging only", "The supplier's location only", "The age of the workshop"], answerIndex: 0, explanation: "The briefing names properties, cost and intended use." },
        { prompt: "What is steel described as?", options: ["An iron-based alloy containing carbon", "A pure non-metal", "A ceramic material", "A polymer"], answerIndex: 0, explanation: "Steel is described as an iron-based alloy containing carbon." },
        { prompt: "Which material is commonly used to insulate wires?", options: ["PVC", "Brass", "Concrete", "Ceramic fibre only"], answerIndex: 0, explanation: "PVC is commonly used to insulate wires and cables." },
        { prompt: "What is a composite material?", options: ["A material combining two or more constituents", "A pure metal", "A type of drawing instrument", "A document revision"], answerIndex: 0, explanation: "The speaker defines composites as combinations of two or more constituents." }
      ]
    },
    {
      id: "en-c05-s01-l02",
      title: "Lesson 2 — Technical Drawing, CAD and CAM",
      level: "B1+–B2",
      script: "A technical drawing communicates the shape and characteristics of a component. It should show accurate dimensions, proportions, symbols and units so that different specialists can understand the same design information. Traditional manual drafting uses tools such as rulers, compasses, set squares and protractors. Computer-aided design, or CAD, allows designers to create and modify digital models. A three-dimensional model can help a team understand how components may fit together. Computer-aided manufacturing, or CAM, uses computer systems to support manufacturing processes. When CAD and CAM are linked, design information can be transferred into a manufacturing workflow. The drawing and model must still be checked against the correct requirements and document revision.",
      questions: [
        { prompt: "What is the main purpose of a technical drawing?", options: ["To communicate a component's characteristics", "To record staff attendance", "To calculate wages", "To replace all written specifications"], answerIndex: 0, explanation: "The briefing says a drawing communicates the shape and characteristics of a component." },
        { prompt: "Which tool is used in manual drafting?", options: ["A protractor", "A soldering iron", "A pressure sensor", "A data logger"], answerIndex: 0, explanation: "A protractor is listed among manual drafting tools." },
        { prompt: "What does CAD stand for?", options: ["Computer-aided design", "Controlled aircraft data", "Computer-assisted diagnosis", "Certified assembly drawing"], answerIndex: 0, explanation: "CAD means computer-aided design." },
        { prompt: "What does CAM support?", options: ["Manufacturing processes", "Passenger booking", "Staff recruitment", "Document translation"], answerIndex: 0, explanation: "CAM supports computer-aided manufacturing processes." }
      ]
    },
    {
      id: "en-c05-s01-l03",
      title: "Lesson 3 — Maintenance Documentation and Technical Manuals",
      level: "B2",
      script: "Before you use this training record, check the document header. The reference number is TRN-QA-014 and the revision is C. Revision B is listed as superseded in this fictional example. The status field says ‘classroom example’, and the applicability field limits the document to a fictional training component. If a revision or applicability statement is unclear, do not guess. Ask the document owner or teacher to confirm which controlled copy is intended for the exercise. In a real organization, follow its approved document-control process.",
      questions: [
        { prompt: "What is the speaker explaining?", options: ["How to check a training document header", "How to repair a component", "How to operate a machine", "How to approve an aircraft"], answerIndex: 0, explanation: "The speaker explains how to check a fictional training record." },
        { prompt: "What is the document reference?", options: ["TRN-QA-014", "TRN-QA-041", "TRN-EL-014", "TRN-QA-104"], answerIndex: 0, explanation: "The reference is TRN-QA-014." },
        { prompt: "Which revision is marked as superseded?", options: ["A", "B", "C", "D"], answerIndex: 1, explanation: "Revision B is listed as superseded." },
        { prompt: "What should a student do if applicability is unclear?", options: ["Guess", "Use the oldest copy", "Ask the document owner or teacher", "Change the revision"], answerIndex: 2, explanation: "The speaker says to ask the responsible document owner or teacher." }
      ]
    },
    {
      id: "en-c05-s01-l04",
      title: "Lesson 4 — Fault Diagnosis: Symptoms, Evidence and Reports",
      level: "B2",
      script: "The reported condition is that a warning message appeared during the classroom simulation. In training log TL-08, revision A, we can see two identical entries. This is an observation from the supplied record. One possible hypothesis is that the entry was duplicated during data handling, but the available evidence does not confirm the cause. The report should identify the time, the source document and the repeated entries. It should also state that the cause remains unresolved. Do not recommend a repair or identify a failed component on the basis of this classroom example.",
      questions: [
        { prompt: "What happened in the classroom simulation?", options: ["A warning message appeared", "A machine stopped permanently", "A component was replaced", "A test was approved"], answerIndex: 0, explanation: "The reported condition is a warning message." },
        { prompt: "What does training log TL-08 contain?", options: ["Two identical entries", "Two different revisions", "A completed repair", "A production approval"], answerIndex: 0, explanation: "The log contains two identical entries." },
        { prompt: "Is the cause confirmed?", options: ["Yes, data handling is confirmed", "No, the cause remains unresolved", "Yes, a component failed", "No, there is no observation"], answerIndex: 1, explanation: "The speaker says the evidence does not confirm the cause." },
        { prompt: "What should the report include?", options: ["An invented repair", "The time, source document and repeated entries", "A component replacement decision", "An operational instruction"], answerIndex: 1, explanation: "The report should identify traceable facts and the unresolved cause." }
      ]
    },
    {
      id: "en-c05-s01-l05",
      title: "Lesson 5 — Electrical Troubleshooting Communication",
      level: "B2",
      script: "Could you give me the document reference for the handover? It is TRN-EL-022, revision B. Let me read that back: TRN-EL-022, revision B. Is that correct? Yes. The classroom record shows a difference between two status descriptions. Has the cause been confirmed? No. We have only recorded the discrepancy. The source information still needs to be reviewed by the responsible teacher. Understood. I will note that the issue remains unresolved and will not make assumptions about the cause. Thank you. Please include the date and the reference in the handover note.",
      questions: [
        { prompt: "What reference is given in the handover?", options: ["TRN-EL-022", "TRN-EL-202", "TRN-QA-022", "TRN-EL-012"], answerIndex: 0, explanation: "The reference is TRN-EL-022." },
        { prompt: "Which revision is mentioned?", options: ["A", "B", "C", "D"], answerIndex: 1, explanation: "The speakers identify revision B." },
        { prompt: "Why does one speaker read the reference back?", options: ["To confirm that it was heard correctly", "To change the revision", "To approve the record", "To identify a fault"], answerIndex: 0, explanation: "Read-back is used to confirm the reference." },
        { prompt: "What is the status of the cause?", options: ["Confirmed", "Unresolved", "Approved", "Closed"], answerIndex: 1, explanation: "The cause has not been confirmed." }
      ]
    },
    {
      id: "en-c05-s01-l06",
      title: "Lesson 6 — Quality Assurance and Non-conformity Reports",
      level: "B2",
      script: "This is a classroom non-conformity example for sample part P-04. The reference is drawing DR-04, revision A. The stated training requirement is that the feature label must be present. The inspection sheet QF-06 shows that the label is missing from the sample record. The report should identify the requirement, the observation and the evidence. No disposition has been assigned in this exercise. The case is for learning how to write a factual report; it does not define a real acceptance criterion or authorize a production decision. Second briefing: The handover concerns training record QA-17. The process sheet is revision B, while the attached classroom summary refers to revision A. This is a document discrepancy. We have not established why the two revisions differ. Please confirm the intended source document with the teacher before continuing the exercise. In the report, identify both references, state that the cause is unknown and keep the original records unchanged.",
      questions: [
        { prompt: "Which sample part is discussed?", options: ["P-04", "P-40", "QF-06", "DR-04"], answerIndex: 0, explanation: "The sample part is P-04." },
        { prompt: "What is missing from the sample record?", options: ["The feature label", "The date", "The drawing title", "The revision letter"], answerIndex: 0, explanation: "The inspection sheet shows that the feature label is missing." },
        { prompt: "Which inspection sheet is mentioned?", options: ["QF-06", "QA-17", "TRN-EL-022", "DR-04"], answerIndex: 0, explanation: "The inspection sheet reference is QF-06." },
        { prompt: "What discrepancy appears in the second briefing?", options: ["Revision B versus revision A", "Two missing part numbers", "A missing date", "A confirmed production defect"], answerIndex: 0, explanation: "The process sheet is B and the summary is A." },
        { prompt: "Has the reason for the revision difference been established?", options: ["Yes", "No"], answerIndex: 1, explanation: "The speaker says the reason has not been established." }
      ]
    },
    {
      id: "en-c05-s01-l07",
      title: "Lesson 7 — Document Revisions and Configuration Control",
      level: "B2",
      script: "Here is the change summary for training document TRN-ENG-031. The previous classroom version was revision C, issued on the fourth of April. The updated classroom version is revision D, issued on the eighteenth of April. The change adds a document-reference field to the training layout. This is a change to the training document, not a statement that an aircraft system has been modified. The change log identifies the two versions. If a related classroom record still shows revision C, note the discrepancy and ask the document owner which version is intended for the exercise. Do not select a version by date alone.",
      questions: [
        { prompt: "Which document is being discussed?", options: ["TRN-ENG-031", "TRN-ENG-013", "TRN-EL-031", "TRN-QA-031"], answerIndex: 0, explanation: "The document reference is TRN-ENG-031." },
        { prompt: "What was the previous revision?", options: ["A", "B", "C", "D"], answerIndex: 2, explanation: "The previous classroom version was revision C." },
        { prompt: "What is the updated revision?", options: ["A", "B", "C", "D"], answerIndex: 3, explanation: "The updated version is revision D." },
        { prompt: "What does the change add?", options: ["A document-reference field", "A new aircraft component", "A maintenance interval", "A production setting"], answerIndex: 0, explanation: "The change adds a reference field to the training layout." }
      ]
    },
    {
      id: "en-c05-s01-l08",
      title: "Lesson 8 — Shift Handover and Technical Correspondence",
      level: "B2",
      script: "This is the handover for training package TP-09. The comparison of the two document headers has been completed. One item remains outstanding: the classroom records refer to revisions C and D of TRN-ENG-031. The intended version has not yet been confirmed. The course tutor is the action owner for this clarification. Please keep the discrepancy visible in the handover note and acknowledge receipt of the message. No operational task or technical approval is being transferred; this is a classroom document-review exercise.",
      questions: [
        { prompt: "What is the training package reference?", options: ["TP-09", "TP-90", "TRN-09", "TP-19"], answerIndex: 0, explanation: "The handover is for TP-09." },
        { prompt: "What remains outstanding?", options: ["Confirmation of the intended document revision", "A physical inspection", "A production approval", "A component delivery"], answerIndex: 0, explanation: "The intended version has not yet been confirmed." },
        { prompt: "Who owns the clarification action?", options: ["The course tutor", "The passenger service manager", "The CNC operator", "The document printer"], answerIndex: 0, explanation: "The course tutor is named as the action owner." },
        { prompt: "What should remain visible in the handover note?", options: ["The discrepancy", "A guessed revision", "A repair decision", "A production release"], answerIndex: 0, explanation: "The discrepancy should remain visible until clarified." }
      ]
    },
    {
      id: "en-c05-s01-l09",
      title: "Lesson 9 — Teamwork Across Engineering Specialisms",
      level: "B2+",
      script: "Let us review the training information pack. The technologist has prepared the process overview, but the material note still needs clarification. The programmer has found that one sample data field uses a different label in the summary. The electrician has identified two different labels in the classroom system glossary; the intended wording is not confirmed. The CNC operator has checked the training drawing and reports that the feature identifier is missing from the example. These are four separate observations, not one confirmed technical fault. We will list each source, keep the questions open and refer them to the relevant document owners. Before closing the meeting, each person will read back their action.",
      questions: [
        { prompt: "How many professional roles contribute observations?", options: ["Two", "Three", "Four", "Five"], answerIndex: 2, explanation: "The technologist, programmer, electrician and CNC operator contribute." },
        { prompt: "What does the programmer identify?", options: ["A different label in a sample data field", "A missing drawing feature", "A material note", "A safety boundary"], answerIndex: 0, explanation: "The programmer reports a different field label." },
        { prompt: "What is missing from the training drawing?", options: ["The feature identifier", "The date", "The revision history", "The material certificate"], answerIndex: 0, explanation: "The CNC operator reports a missing feature identifier." },
        { prompt: "How should the team treat the observations?", options: ["As four separate open observations", "As one confirmed technical fault", "As an approval decision", "As reasons to delete the records"], answerIndex: 0, explanation: "The speaker explicitly distinguishes four observations from one confirmed fault." }
      ]
    },
    {
      id: "en-c05-s01-l10",
      title: "Lesson 10 — Interpreting Drawings, Tables and Trend Charts",
      level: "B2+",
      script: "This chart presents two fictional data series over six weeks. The horizontal axis shows the week number, and the vertical axis shows arbitrary index units. Series A rises from ten units in Week 1 to a peak of fourteen in Week 4. It then falls to twelve in Week 5 before increasing slightly to thirteen. Series B increases more gradually and reaches eleven units in Week 5, then falls to ten. Series A remains above Series B throughout the period. The chart describes the pattern, but it does not explain the cause. The source is a classroom dataset, and the values must not be interpreted as real engineering measurements. Second briefing: The team has completed the first review of the classroom information pack. The document register identifies revision D of TRN-ENG-031 as the updated training version, but one attached summary still refers to revision C. The technologist has supplied the process overview, and the programmer has supplied the sample data dictionary. The data dictionary contains one field label that needs confirmation. The electrician’s glossary and the CNC drawing example are included, but the drawing identifier remains an open question. The team will record each discrepancy, identify the relevant document owner and update the handover note after confirmation.",
      questions: [
        { prompt: "How many weeks are shown in the chart?", options: ["Four", "Five", "Six", "Seven"], answerIndex: 2, explanation: "The chart covers six weeks." },
        { prompt: "When does Series A reach its peak?", options: ["Week 1", "Week 3", "Week 4", "Week 6"], answerIndex: 2, explanation: "Series A reaches fourteen units in Week 4." },
        { prompt: "What happens to Series A in Week 5?", options: ["It rises to sixteen", "It falls to twelve", "It remains at fourteen", "It falls to ten"], answerIndex: 1, explanation: "Series A falls to twelve in Week 5." },
        { prompt: "Does the chart explain the cause of the pattern?", options: ["Yes", "No"], answerIndex: 1, explanation: "The speaker says the chart describes the pattern but does not explain its cause." },
        { prompt: "Which revision is identified as the updated classroom version?", options: ["A", "B", "C", "D"], answerIndex: 3, explanation: "The document register identifies revision D." }
      ]
    },
    {
      id: "en-c05-s01-l11",
      title: "Lesson 11 — Risk Assessment and Safety Reporting",
      level: "B2+",
      script: "I would like to report a concern from the simulated training area. In photograph SAFE-TR-05, the marked boundary is not visible. I cannot confirm from the photograph whether the boundary was missing in the room or simply outside the camera view. I informed the teacher and kept the original image with the classroom record. No risk rating has been assigned in this language exercise. The teacher will review the training setup under the institution’s local safety arrangements. I am reporting what I observed, not making a conclusion about the cause.",
      questions: [
        { prompt: "What is not visible in photograph SAFE-TR-05?", options: ["The marked boundary", "A document title", "A data label", "A revision letter"], answerIndex: 0, explanation: "The marked boundary is not visible in the photograph." },
        { prompt: "Can the speaker confirm why it is not visible?", options: ["Yes, it was removed", "No, it may be outside the camera view", "Yes, the room was empty", "No, the photo is deleted"], answerIndex: 1, explanation: "The speaker cannot distinguish absence from camera framing." },
        { prompt: "Who was informed?", options: ["The teacher", "The document supplier", "The passenger", "The data owner"], answerIndex: 0, explanation: "The speaker informed the teacher." },
        { prompt: "Has a risk rating been assigned?", options: ["Yes", "No"], answerIndex: 1, explanation: "No risk rating is assigned in the language exercise." }
      ]
    },
    {
      id: "en-c05-s01-l12",
      title: "Lesson 12 — Integrated Technical Briefing: From Task to Report",
      level: "B2+",
      script: "Good morning. This briefing summarizes the fictional Training Information Pack Review, reference TP-15. Our objective was to review the clarity and consistency of four classroom documents. We compared their references, labels and sample information. The review identified one process-sheet note that needs clarification and one data field with inconsistent labels. We also found two terms for the same sample concept in the glossary, while the training drawing example does not show its feature identifier. The scope excluded physical inspection, equipment operation, production approval and aircraft maintenance. The source pack contains fictional information only. We recommend recording each finding, assigning a document owner to clarify it and updating the handover after confirmation. No operational status or approval decision has been made. Follow-up: The team has completed the language and document-consistency review for TP-15. The glossary owner has confirmed the preferred classroom term. Two items remain open: the process-sheet note and the missing feature identifier in the training drawing. The technologist and CNC operator will refer those questions to the relevant document owners. The final report will state that the review covered classroom documents only. It did not include physical inspection, equipment operation, production approval or aircraft maintenance.",
      questions: [
        { prompt: "What is the project reference?", options: ["TP-15", "TP-51", "TRN-15", "TP-05"], answerIndex: 0, explanation: "The fictional review is TP-15." },
        { prompt: "How many classroom documents were reviewed?", options: ["Two", "Three", "Four", "Five"], answerIndex: 2, explanation: "The review covered four classroom documents." },
        { prompt: "Which item has a missing identifier?", options: ["The training drawing feature", "The glossary owner", "The process sheet date", "The data dictionary title"], answerIndex: 0, explanation: "The training drawing example lacks its feature identifier." },
        { prompt: "Which activities were excluded?", options: ["Physical inspection, equipment operation, production approval and aircraft maintenance", "Vocabulary review and listening", "Document comparison and reporting", "Glossary clarification"], answerIndex: 0, explanation: "The speaker explicitly lists the excluded operational activities." },
        { prompt: "What remains open after the follow-up?", options: ["The process-sheet note and missing drawing feature identifier", "The glossary term only", "The project reference", "The number of documents"], answerIndex: 0, explanation: "Two items remain open." }
      ]
    },
    {
      id: "en-c05-s02-l01",
      title: "Lesson 1 — Delivering a Technical Presentation",
      level: "B2",
      script: "Good morning, everyone. The purpose of this briefing is to present the results of the fictional Aviation Training Data Review, reference ATD-08. Our audience includes colleagues from four specialisms, so I will explain the terms that may be unfamiliar. The scope is limited to four classroom documents: a sample process sheet, a data dictionary, a wiring-diagram glossary and a CNC drawing extract. We identified an inconsistent term, one missing identifier and two records with incomplete units. The review did not include physical equipment, live production data, aircraft maintenance or operational testing. I will begin by explaining the sources, then present the findings and limitations. After that, I will hand over to the programmer for the data-label example.",
      questions: [
        { prompt: "What is the speaker doing?", options: ["Giving a passenger announcement", "Opening a technical briefing about a fictional information-pack review", "Explaining how to repair an aircraft", "Giving instructions for operating a CNC machine"], answerIndex: 1, explanation: "The speaker opens a briefing about a fictional classroom review." },
        { prompt: "What is the scope?", options: ["A physical inspection of an aircraft", "A production release decision", "A review of four classroom documents", "A live electrical test"], answerIndex: 2, explanation: "The scope is limited to four classroom documents." },
        { prompt: "What is the project reference?", options: ["ATD-08", "ATD-80", "ADB-08", "ATD-18"], answerIndex: 0, explanation: "The project reference is ATD-08." },
        { prompt: "How many classroom documents are included?", options: ["Two", "Three", "Four", "Eight"], answerIndex: 2, explanation: "The briefing lists four classroom documents." },
        { prompt: "Which issue is mentioned?", options: ["A missing passenger record", "An inconsistent term", "A damaged aircraft component", "An unapproved machine setting"], answerIndex: 1, explanation: "One inconsistent term was identified." },
        { prompt: "What is explicitly excluded?", options: ["A review of document labels", "A review of classroom sources", "Physical equipment, live production data, maintenance and operational testing", "A handover to the programmer"], answerIndex: 2, explanation: "The speaker explicitly excludes real equipment and operational activity." }
      ]
    },
    {
      id: "en-c05-s02-l02",
      title: "Lesson 2 — Writing a Structured Technical Report",
      level: "B2",
      script: "Could we review the draft report before it is submitted? The objective and scope are clear, but the source document reference is missing. Please add the reference to the sample data dictionary. I also noticed that the results section says the information system is unreliable. The review only identified one missing label and one inconsistent term in a five-row classroom sample. That evidence does not support a general statement about system reliability. Please separate the observation from the interpretation, describe the sample limitation and list the two items that require clarification. The conclusion should state only what the review established. The document owner can then confirm the preferred labels and update the report history.",
      questions: [
        { prompt: "What are the speakers reviewing?", options: ["A draft classroom technical report", "A real aircraft release certificate", "A staff timetable", "A passenger announcement"], answerIndex: 0, explanation: "They are reviewing a draft classroom report." },
        { prompt: "What is the main problem?", options: ["The report has no title and no pictures", "It makes a conclusion that is broader than the evidence", "It contains too many appendices", "It is written in the wrong language"], answerIndex: 1, explanation: "The claim about system reliability exceeds the small sample evidence." },
        { prompt: "Which reference is missing?", options: ["The source document reference", "The student group number", "The room number", "The printer model"], answerIndex: 0, explanation: "The source document reference is missing." },
        { prompt: "What should be separated?", options: ["The title and date", "The observation and interpretation", "The author and reader", "The table and appendix"], answerIndex: 1, explanation: "The writer should separate the observed finding from its interpretation." },
        { prompt: "What should the writer add?", options: ["An unsupported cause", "A list of passenger names", "The limitations of the review", "A production approval"], answerIndex: 2, explanation: "The report must explain the sample limitation." }
      ]
    },
    {
      id: "en-c05-s02-l03",
      title: "Lesson 3 — Professional Interview and Oral Examination Skills",
      level: "B2",
      script: "Examiner: Why is revision control important in a technical environment? Candidate: Revision control helps a team identify the version of a document being used. It reduces confusion when information is updated. Examiner: Can you give an example? Candidate: Yes. In a fictional classroom case, a drawing extract showed revision C, while a related process sheet referred to revision B. The difference was recorded as an open question. Examiner: Does that prove that one document is incorrect? Candidate: Not by itself. We would need to check the controlled document register and confirm which revision applies to the task. The cause of the mismatch has not been established. Examiner: What would you do next? Candidate: I would record the two references, avoid making an unsupported choice and ask the responsible document owner to confirm the current version. I would then update the handover with the confirmed information.",
      questions: [
        { prompt: "What is the situation?", options: ["A candidate is answering an oral technical question", "A pilot is speaking to passengers", "An operator is starting a production cycle", "A student is ordering lunch"], answerIndex: 0, explanation: "The recording is an examiner-candidate exchange." },
        { prompt: "What is the candidate's main strength?", options: ["The candidate guesses quickly", "The candidate structures the answer and identifies a limitation", "The candidate avoids every question", "The candidate changes the subject"], answerIndex: 1, explanation: "The candidate explains the concept and states what remains unconfirmed." },
        { prompt: "What topic is the examiner asking about?", options: ["Revision control", "Staff holidays", "Aircraft seating", "Food safety"], answerIndex: 0, explanation: "The examiner asks about revision control." },
        { prompt: "What example does the candidate use?", options: ["A fictional mismatch between two document revisions", "A real aircraft repair", "A passenger complaint", "A personal travel story"], answerIndex: 0, explanation: "The candidate describes a fictional revision mismatch." },
        { prompt: "What does the candidate say is not established?", options: ["The document title", "The cause of the mismatch", "The candidate's name", "The classroom number"], answerIndex: 1, explanation: "The cause of the mismatch has not been established." },
        { prompt: "What does the candidate recommend?", options: ["Guess which revision is correct", "Delete the older file", "Record both references and ask the document owner to confirm the current version", "Use either file without checking"], answerIndex: 2, explanation: "The candidate recommends checking the controlled register and confirming the current version." }
      ]
    },
    {
      id: "en-c05-s02-l04",
      title: "Lesson 4 — Reading Specifications, Procedures and Standards",
      level: "B2",
      script: "Student: I found a document extract for our technical report. It is called Training Specification TS-17, revision B. Can I use it as the source? Teacher: First, check its scope and status. The extract says that it is a classroom language exercise. Student: So it can help us practise document vocabulary, but it is not an operational specification? Teacher: Correct. Also, do not assume that revision B is the current controlled version. The exercise only identifies the revision printed on this extract. Student: Should I write that limitation in the report? Teacher: Yes. State that the source is a classroom extract and that its current applicability has not been confirmed. If a real task requires a controlled document, the responsible person must verify the approved source. Student: Understood. I will cite TS-17, revision B, as the supplied classroom extract and keep the limitation clear.",
      questions: [
        { prompt: "What are the speakers discussing?", options: ["Whether a fictional document extract is applicable to a classroom task", "How to repair an aircraft", "How to change a live electrical system", "Which machine should be operated"], answerIndex: 0, explanation: "They discuss the use and limitations of a classroom document extract." },
        { prompt: "What is the main concern?", options: ["The document's title is too long", "The scope and revision need to be checked", "The classroom is too noisy", "The report needs a photograph"], answerIndex: 1, explanation: "The student must verify scope and controlled revision." },
        { prompt: "What is the document reference?", options: ["TS-17", "ST-71", "TS-71", "T5-17"], answerIndex: 0, explanation: "The document is identified as TS-17." },
        { prompt: "Which revision appears in the classroom extract?", options: ["A", "B", "C", "D"], answerIndex: 1, explanation: "The printed revision is B." },
        { prompt: "What does the student need to confirm?", options: ["The document's applicability and current controlled revision", "The colour of the cover", "The author's personal opinion", "The number of pages only"], answerIndex: 0, explanation: "The student must confirm applicability and current controlled status." },
        { prompt: "What should the student do if the source cannot be confirmed?", options: ["Treat the extract as approved", "Guess the current revision", "State the limitation and ask the responsible person to verify the approved source", "Use it for a real maintenance task"], answerIndex: 2, explanation: "The source must remain identified as an unconfirmed classroom extract." }
      ]
    },
    {
      id: "en-c05-s02-l05",
      title: "Lesson 5 — Manufacturing Process Review and Improvement",
      level: "B2",
      script: "The process-document review covered eight fictional training records. The material-identification stage was documented in all eight records, although one source reference needs clarification. Two records use different terms for the same process stage. The handover section contains three records without an identified action owner. This is an observation about the sample; it does not establish why the fields are missing or whether the same issue exists elsewhere. We recommend that the document owner review the handover template and confirm how action ownership should be recorded. Any wider process change would require a separate review by the responsible team.",
      questions: [
        { prompt: "What is the speaker reporting?", options: ["A fictional process-document review", "A confirmed aircraft production defect", "A machine operating procedure", "A passenger service issue"], answerIndex: 0, explanation: "The speaker reviews fictional training records." },
        { prompt: "What is the main finding?", options: ["Every record is incomplete", "Three handover records do not identify an action owner", "The process has been officially approved", "The team changed a real production parameter"], answerIndex: 1, explanation: "Three handover records lack an action owner." },
        { prompt: "How many training records were reviewed?", options: ["Three", "Six", "Eight", "Eighteen"], answerIndex: 2, explanation: "The speaker says eight fictional records were reviewed." },
        { prompt: "How many handover records lack an action owner?", options: ["One", "Two", "Three", "Eight"], answerIndex: 2, explanation: "Three records have no identified action owner." }
      ]
    },
    {
      id: "en-c05-s02-l06",
      title: "Lesson 6 — CNC Program Review and Revision Communication",
      level: "B2",
      script: "I have compared the two files in the CNC training package. Both use the training ID CNC-TR-04, but their names and header revisions need to be read together. File B includes the letter B in its name and shows revision B in the header. However, the change note only says ‘label updated’, and the approval status is not stated. I have recorded the file names, header information and the missing status field in the review note. I have not selected either file for equipment use. The document owner must confirm the intended classroom version and update the change record.",
      questions: [
        { prompt: "What is the discussion about?", options: ["A revision mismatch in a fictional CNC training file", "A real machine setup instruction", "A passenger information display", "A material delivery"], answerIndex: 0, explanation: "The speaker compares two versions in a training package." },
        { prompt: "What is the reviewer asked to do?", options: ["Select a file and start production", "Record the discrepancy and request clarification", "Delete the change history", "Rewrite the program without review"], answerIndex: 1, explanation: "The reviewer records the mismatch and asks the document owner to clarify." },
        { prompt: "What is the training file ID?", options: ["CNC-TR-04", "CNC-TR-40", "CNC-TB-04", "CN-TR-14"], answerIndex: 0, explanation: "Both files use CNC-TR-04." },
        { prompt: "What does the file name and header of File B show?", options: ["Revision A", "Revision B", "Revision C", "No identifier"], answerIndex: 1, explanation: "File B shows revision B in its name and header." }
      ]
    },
    {
      id: "en-c05-s02-l07",
      title: "Lesson 7 — Electrical System Fault-isolation Case Discussion",
      level: "B2",
      script: "Let us review training case ELEC-CASE-12. The report describes an indicator that was not visible in one classroom observation and was visible in a later observation. We have two observation notes and a simplified training diagram. However, the test conditions are not fully described, the diagram's applicability has not been confirmed and there is no complete measurement record. We therefore cannot identify a confirmed cause or make a statement about the condition of a real electrical system. The next step in this language exercise is to list the missing information and refer the case to the responsible instructor. Our summary must distinguish the reported symptom from any possible explanation.",
      questions: [
        { prompt: "What is the team discussing?", options: ["A fictional electrical training case", "A confirmed aircraft defect", "A real maintenance task", "A CNC production schedule"], answerIndex: 0, explanation: "The case is explicitly a classroom training scenario." },
        { prompt: "What is the main conclusion?", options: ["A component must be replaced", "The cause is confirmed", "The evidence is incomplete and the case needs review", "The diagram can be ignored"], answerIndex: 2, explanation: "Missing test conditions and measurement records prevent a conclusion." },
        { prompt: "What is the training reference?", options: ["ELEC-CASE-12", "ELEC-CASE-21", "EL-CASE-12", "ELEC-12"], answerIndex: 0, explanation: "The case reference is ELEC-CASE-12." },
        { prompt: "What evidence is supplied?", options: ["Two observation notes and a simplified training diagram", "A complete certified test report", "A signed maintenance release", "A live measurement from an aircraft"], answerIndex: 0, explanation: "The speaker identifies two notes and a simplified diagram." }
      ]
    },
    {
      id: "en-c05-s02-l08",
      title: "Lesson 8 — Software Test Results and Data-processing Reports",
      level: "B2",
      script: "This is the summary of the fictional software test set for build EDU-5. Five test cases were reviewed in the classroom environment. SW-01 and SW-04 passed. SW-02 failed because the required unit field was missing from the sample record. SW-03 generated a warning because a duplicate record ID was detected. SW-05 failed because its label mapping differed from the supplied sample dictionary. The summary identifies the observed results, but it does not establish the underlying cause of either failed test. The next step is to preserve the test references, review the input data and confirm the expected mapping with the data owner. No conclusion about real aircraft equipment can be drawn from this exercise.",
      questions: [
        { prompt: "What is being presented?", options: ["A fictional software test summary", "A live aircraft system diagnosis", "A CNC machining instruction", "A passenger boarding announcement"], answerIndex: 0, explanation: "The speaker introduces a fictional software test set." },
        { prompt: "What is the main message?", options: ["All tests passed", "Two test cases need review and one warning concerns a duplicate ID", "The software has been approved for aircraft use", "The test environment was not recorded"], answerIndex: 1, explanation: "SW-02 and SW-05 failed; SW-03 generated a duplicate-ID warning." },
        { prompt: "How many test cases are listed?", options: ["Three", "Four", "Five", "Eight"], answerIndex: 2, explanation: "Five test cases were reviewed." },
        { prompt: "Which test has a missing unit field?", options: ["SW-01", "SW-02", "SW-03", "SW-04"], answerIndex: 1, explanation: "SW-02 failed because its unit field was missing." }
      ]
    },
    {
      id: "en-c05-s02-l09",
      title: "Lesson 9 — Aircraft Component Materials and Inspection Records",
      level: "B2–B2+",
      script: "This is a review of four fictional component material records. Each record has a sample ID, a material family and a lot reference. MAT-21 and MAT-24 show certificate references and complete sample fields. MAT-22 has no certificate reference entered, so its source documentation needs clarification. MAT-23 includes a certificate reference, but the inspection scope field is incomplete. These observations describe the records only. They do not establish the physical condition or acceptance status of any real component. The next step is to refer both documentation gaps to the document owner and confirm the required supporting evidence.",
      questions: [
        { prompt: "What is the speaker reviewing?", options: ["A fictional materials register", "A real aircraft repair", "A passenger manifest", "A CNC operating sequence"], answerIndex: 0, explanation: "The speaker explicitly introduces four fictional material records." },
        { prompt: "What is the main documentation issue?", options: ["Every sample lacks a lot reference", "One certificate reference is missing and another inspection scope is incomplete", "All material families are identical", "The register has been approved for production"], answerIndex: 1, explanation: "MAT-22 lacks a certificate reference; MAT-23 has an incomplete inspection-scope field." },
        { prompt: "Which sample has no certificate reference entered?", options: ["MAT-21", "MAT-22", "MAT-23", "MAT-24"], answerIndex: 1, explanation: "The speaker identifies MAT-22." },
        { prompt: "What does a missing certificate reference prove?", options: ["The material is defective", "The material is acceptable", "It identifies a documentation gap that needs review", "It confirms corrosion"], answerIndex: 2, explanation: "A missing field is a record gap, not a conclusion about physical condition." }
      ]
    },
    {
      id: "en-c05-s02-l10",
      title: "Lesson 10 — Maintenance Planning, Reliability and Service Records",
      level: "B2–B2+",
      script: "This monthly training summary covers four fictional reporting periods. The simulated operating hours increase from one hundred and twenty in January to two hundred and ten in April. Recorded events are three in January, three in February, four in March and four in April. The event count therefore rises slightly across the sample, but the table alone does not explain why. Before interpreting the pattern, the team should check how events were defined, whether reporting practices changed and whether the data covers the same population. This classroom example does not establish a reliability rate or justify a maintenance interval change. The proposed next step is to review the data definitions and the reporting context.",
      questions: [
        { prompt: "What is the briefing about?", options: ["A fictional monthly reliability summary", "A confirmed aircraft defect", "A maintenance procedure", "A material certificate"], answerIndex: 0, explanation: "It is a classroom summary of simulated reporting periods." },
        { prompt: "What is the speaker's main point?", options: ["Event counts rose, but the data needs context", "The system has failed", "The maintenance interval must be changed", "The records can be deleted"], answerIndex: 0, explanation: "The speaker cautions against interpreting counts without context." },
        { prompt: "How many simulated operating hours are shown for April?", options: ["120", "150", "180", "210"], answerIndex: 3, explanation: "April shows 210 simulated operating hours." },
        { prompt: "How many events were recorded in March?", options: ["Two", "Three", "Four", "Five"], answerIndex: 2, explanation: "March has four recorded events." }
      ]
    },
    {
      id: "en-c05-s02-l11",
      title: "Lesson 11 — Integrated Listening: Technical Briefings and Handover",
      level: "B2+",
      script: "Coordinator: Welcome to the training-project handover. We have four open review items. I will confirm the status and the next action for each one. Technologist: For materials record MAT-22, the lot reference is present, but the certificate source has not been entered. The document owner needs to confirm the reference. This is a record gap, not a material-condition conclusion. CNC instructor: The CNC training file has a revision note that does not explain the change clearly. The training coordinator will clarify the version label before the teaching pack is updated. No equipment-use decision is part of this exercise. Electrical instructor: Case ELEC-CASE-12 remains open because the supplied observations do not include a complete evidence set. The instructor will list the missing information. We have not identified a cause. Programmer: Test SW-02 failed the classroom validation because its unit field is missing. The data team will review the validation rule and the sample input. The current report does not explain why the field was absent. Coordinator: Thank you. The receiving team should preserve the four references, check each action owner and record the next update. Please keep confirmed facts separate from possible explanations.",
      questions: [
        { prompt: "What is the purpose of the meeting?", options: ["To hand over four open classroom review items", "To approve aircraft maintenance", "To issue a production release", "To cancel all documentation"], answerIndex: 0, explanation: "The coordinator describes a training-project handover." },
        { prompt: "How many items remain open?", options: ["One", "Two", "Three", "Four"], answerIndex: 3, explanation: "Four records are discussed and remain open for review." },
        { prompt: "Who is asked to confirm the MAT-22 source reference?", options: ["The document owner", "The passenger service team", "The CNC operator", "The data analyst"], answerIndex: 0, explanation: "The technologist assigns this follow-up to the document owner." },
        { prompt: "What is unclear in the CNC training file?", options: ["The revision note", "The material family", "The operating hours", "The test date"], answerIndex: 0, explanation: "The revision note does not explain the change clearly." },
        { prompt: "What is the issue with SW-02?", options: ["The unit field is missing", "The file is deleted", "The test passed", "The sample has no ID"], answerIndex: 0, explanation: "The programmer reports a missing unit field." }
      ]
    },
    {
      id: "en-c05-s02-l12",
      title: "Lesson 12 — Capstone Case: Presenting an Engineering Solution",
      level: "B2+",
      script: "Today’s project review covers four fictional records. First, materials record MAT-22 includes a lot reference, but the certificate source has not been entered. The document owner will confirm the reference. Second, CNC training file CNC-TR-04 is labelled revision B, but the change note does not explain the update and the approval status is not stated. The training coordinator will clarify the document history. Third, electrical case ELEC-CASE-12 contains two classroom observations, but the complete measurement record and test conditions are missing. No cause can be established. The instructor will list the missing information. Finally, software test SW-02 failed its simulated validation because the required unit field was absent. The data team will review the sample input and validation rule. The project presentation must distinguish these confirmed observations from open questions and must not make claims about real aircraft equipment.",
      questions: [
        { prompt: "What is the team's objective?", options: ["To approve a real aircraft for service", "To review a fictional documentation package and assign follow-up actions", "To change a CNC program", "To diagnose an electrical fault"], answerIndex: 1, explanation: "The meeting reviews fictional records and allocates follow-up." },
        { prompt: "How many records are discussed?", options: ["Two", "Three", "Four", "Five"], answerIndex: 2, explanation: "Materials, CNC, electrical and software records are discussed." },
        { prompt: "Which record needs a certificate source reference?", options: ["MAT-22", "CNC-TR-04", "ELEC-CASE-12", "SW-02"], answerIndex: 0, explanation: "MAT-22 has no certificate source entered." },
        { prompt: "Why is no electrical cause stated?", options: ["The diagram is too colourful", "The complete measurement record and test conditions are missing", "The software test passed", "The material family is unknown"], answerIndex: 1, explanation: "The case lacks the measurement record and test conditions needed to establish a cause." },
        { prompt: "What should the final presentation include?", options: ["Unsupported conclusions", "Confirmed facts, limitations, owners and follow-up actions", "A real maintenance procedure", "Invented missing values"], answerIndex: 1, explanation: "The capstone requires evidence-based reporting and explicit limitations." }
      ]
    },
      {
      "id": "en-c03-s01-l01",
      "title": "Course 3 · Semester 1 · Materials in Mechanical Engineering",
      "level": "B1+–B2",
      "script": "A materials engineer is explaining why material selection matters in mechanical engineering. Metals are often chosen for strength, toughness and the ability to be formed or machined. Aluminium alloys are valued when low weight is important. Steel is widely used where strength and wear resistance are required. Polymers can provide electrical insulation or reduce weight, while ceramics can resist heat and wear but may be brittle. No material is best for every application. Engineers compare properties, operating conditions, manufacturing methods, cost and documentation. In aviation, material selection is especially important because a component must meet defined requirements. This recording is an introduction to material vocabulary, not a material approval or repair instruction.",
      "questions": [
        {
          "prompt": "Which property may make aluminium alloys useful?",
          "options": [
            "Low weight",
            "High transparency",
            "Magnetic memory",
            "Electrical conductivity only"
          ],
          "answerIndex": 0,
          "explanation": "Aluminium alloys are valued when low weight is important."
        },
        {
          "prompt": "What is one possible use of polymers?",
          "options": [
            "Electrical insulation",
            "Aircraft navigation",
            "Measuring pressure directly",
            "Generating radio waves"
          ],
          "answerIndex": 0,
          "explanation": "The speaker says polymers can provide electrical insulation."
        },
        {
          "prompt": "Why is no material best for every application?",
          "options": [
            "Engineers must compare properties and conditions",
            "All materials have identical properties",
            "Cost is always the only factor",
            "Manufacturing methods never matter"
          ],
          "answerIndex": 0,
          "explanation": "The choice depends on properties, conditions, process, cost and documentation."
        },
        {
          "prompt": "What is the purpose of this recording?",
          "options": [
            "Introduce material vocabulary",
            "Approve an aircraft component",
            "Give repair instructions",
            "Set production acceptance limits"
          ],
          "answerIndex": 0,
          "explanation": "It is explicitly an introductory vocabulary lesson."
        }
      ]
    },
    {
      "id": "en-c03-s01-l02",
      "title": "Course 3 · Semester 1 · Casting, Drawing and Forging",
      "level": "B1+–B2",
      "script": "A production instructor compares three metal-forming processes. In casting, molten metal is poured into a mould and allowed to solidify. The mould gives the part its general shape. In drawing, a metal rod or wire is pulled through a die to reduce its cross-section and increase its length. In forging, a workpiece is shaped by compressive force, often using a hammer or press. The instructor asks students to match each process with its description and to notice the verbs pour, solidify, pull and compress. The processes can produce different shapes and properties, so engineers select them according to the component design and production requirements. The examples are for language study and do not specify production parameters.",
      "questions": [
        {
          "prompt": "What happens during casting?",
          "options": [
            "Molten metal is poured into a mould",
            "A rod is pulled through a die",
            "A workpiece is joined by a cable",
            "A surface is polished"
          ],
          "answerIndex": 0,
          "explanation": "Casting uses molten metal and a mould."
        },
        {
          "prompt": "What happens during drawing?",
          "options": [
            "Metal is pulled through a die",
            "Metal is poured into sand",
            "A part is measured with a caliper",
            "A tool rotates against a surface"
          ],
          "answerIndex": 0,
          "explanation": "Drawing reduces cross-section by pulling material through a die."
        },
        {
          "prompt": "Which process uses compressive force?",
          "options": [
            "Forging",
            "Casting",
            "Drawing",
            "Painting"
          ],
          "answerIndex": 0,
          "explanation": "Forging shapes a workpiece by compressive force."
        },
        {
          "prompt": "Which verbs are highlighted?",
          "options": [
            "Pour, solidify, pull and compress",
            "Upload, download, click and save",
            "Heat, fly, land and taxi",
            "Open, print, scan and email"
          ],
          "answerIndex": 0,
          "explanation": "These verbs describe the processes."
        }
      ]
    },
    {
      "id": "en-c03-s01-l03",
      "title": "Course 3 · Semester 1 · Rolling, Extrusion and Sheet Forming",
      "level": "B1+–B2",
      "script": "A manufacturing lecturer describes three processes used to shape metal. Rolling passes material between rotating rolls to reduce thickness or create a profile. Extrusion pushes material through a shaped opening called a die, producing a long product with a constant cross-section. Sheet forming changes the shape of thin metal sheet by bending, stretching or pressing it. The lecturer shows examples such as a rolled plate, an extruded profile and a formed panel. Students compare the starting material, the direction of force and the resulting shape. They also practise describing a sequence with first, then, after that and finally. The examples explain process vocabulary only; actual production depends on approved process documentation.",
      "questions": [
        {
          "prompt": "What do rotating rolls do?",
          "options": [
            "Reduce thickness or create a profile",
            "Measure electrical resistance",
            "Join two wires",
            "Read a drawing revision"
          ],
          "answerIndex": 0,
          "explanation": "Rolling passes material between rotating rolls."
        },
        {
          "prompt": "What is pushed through a die in extrusion?",
          "options": [
            "Material",
            "A measuring instrument",
            "A software file",
            "A sensor signal"
          ],
          "answerIndex": 0,
          "explanation": "Extrusion pushes material through a shaped opening."
        },
        {
          "prompt": "Which process shapes thin metal sheet?",
          "options": [
            "Sheet forming",
            "Network routing",
            "Casting only",
            "Electrical bonding"
          ],
          "answerIndex": 0,
          "explanation": "Sheet forming changes the shape of thin metal sheet."
        },
        {
          "prompt": "Which words help describe process sequence?",
          "options": [
            "First, then, after that, finally",
            "Although, unless, despite, whereas",
            "Above, below, beside, between",
            "Who, whose, whom, which"
          ],
          "answerIndex": 0,
          "explanation": "These are sequence markers."
        }
      ]
    },
    {
      "id": "en-c03-s01-l04",
      "title": "Course 3 · Semester 1 · Technical Drawing and Tools",
      "level": "B1+–B2",
      "script": "A design tutor is introducing a technical drawing. The drawing includes a title block, a scale, dimensions, symbols and several views of the component. The front view shows the main shape, while the side and top views provide additional information. A centre line indicates an axis or centre. A hidden line represents an edge that cannot be seen in that view. The title block may contain the drawing number, revision, material and approval information. The tutor reminds students to check the drawing revision before discussing a component. A drawing is a controlled technical document, not simply a picture. The class uses a training example and does not make manufacturing decisions from an incomplete drawing.",
      "questions": [
        {
          "prompt": "What information may appear in the title block?",
          "options": [
            "Drawing number and revision",
            "Weather and temperature outside",
            "Student attendance only",
            "Network password"
          ],
          "answerIndex": 0,
          "explanation": "The title block may contain drawing number and revision."
        },
        {
          "prompt": "What does a hidden line represent?",
          "options": [
            "An edge that cannot be seen in that view",
            "The centre of a circle",
            "A dimension tolerance only",
            "A material certificate"
          ],
          "answerIndex": 0,
          "explanation": "The recording defines a hidden line this way."
        },
        {
          "prompt": "Why check the revision?",
          "options": [
            "To make sure the drawing version is current for the task",
            "To find the drawing colour",
            "To estimate the component weight",
            "To choose a computer password"
          ],
          "answerIndex": 0,
          "explanation": "Revision control helps avoid using an outdated drawing."
        },
        {
          "prompt": "What is a technical drawing?",
          "options": [
            "A controlled technical document",
            "An informal sketch with no requirements",
            "A production machine",
            "A measurement device"
          ],
          "answerIndex": 0,
          "explanation": "The tutor stresses that it is a controlled document."
        }
      ]
    },
    {
      "id": "en-c03-s01-l05",
      "title": "Course 3 · Semester 1 · CAD and CAM Systems",
      "level": "B1+–B2",
      "script": "A manufacturing engineer explains the difference between CAD and CAM. Computer-aided design, or CAD, is used to create and modify digital models and technical drawings. Computer-aided manufacturing, or CAM, uses digital information to help plan or generate manufacturing operations. A CAD model may describe geometry, while a CAM project may contain toolpath information for a particular manufacturing process. The two systems can exchange data, but the information must be checked. A model is not automatically a complete manufacturing instruction. The engineer highlights file versions, units, coordinate systems and approved post-processing. Students practise explaining how design information moves into production planning without treating a classroom model as a machine-ready program.",
      "questions": [
        {
          "prompt": "What is CAD mainly used for?",
          "options": [
            "Creating and modifying digital models and drawings",
            "Measuring current",
            "Inspecting a finished surface",
            "Transmitting radio signals"
          ],
          "answerIndex": 0,
          "explanation": "CAD supports digital design and drawing."
        },
        {
          "prompt": "What does CAM help with?",
          "options": [
            "Planning or generating manufacturing operations",
            "Writing passenger announcements",
            "Checking a student's attendance",
            "Measuring temperature"
          ],
          "answerIndex": 0,
          "explanation": "CAM uses digital information for manufacturing operations."
        },
        {
          "prompt": "Does a CAD model automatically become a complete manufacturing instruction?",
          "options": [
            "No",
            "Yes, in every case",
            "Only if the file is colourful",
            "Only if it is printed"
          ],
          "answerIndex": 0,
          "explanation": "The recording explicitly says it does not."
        },
        {
          "prompt": "Which details must be checked when exchanging data?",
          "options": [
            "Versions, units and coordinate systems",
            "Only file colour",
            "The computer wallpaper",
            "The operator's age"
          ],
          "answerIndex": 0,
          "explanation": "The engineer lists versions, units and coordinate systems."
        }
      ]
    },
    {
      "id": "en-c03-s01-l06",
      "title": "Course 3 · Semester 1 · The Aviation Industry: Aircraft Types and Main Sectors",
      "level": "B1+–B2",
      "script": "A college group is preparing a presentation about the aviation industry. The instructor explains that civil aviation includes passenger and cargo transport, while general aviation includes a wide range of non-scheduled activities. Military aviation has different missions and requirements. Aircraft can also be grouped by their design and purpose: fixed-wing aeroplanes, helicopters and unmanned aircraft are familiar examples. The industry is broader than aircraft operators. It includes design organizations, manufacturers, airports, maintenance providers, suppliers, regulators and training centres. Each organization has a different role, but they depend on clear technical communication. The students are asked to describe the sector using terms such as manufacturer, operator, supplier and regulator.",
      "questions": [
        {
          "prompt": "What does civil aviation include?",
          "options": [
            "Passenger and cargo transport",
            "Only military missions",
            "Only space exploration",
            "Only model aircraft"
          ],
          "answerIndex": 0,
          "explanation": "The speaker names passenger and cargo transport."
        },
        {
          "prompt": "Which is an example of a rotorcraft?",
          "options": [
            "Helicopter",
            "Glider",
            "Cargo ship",
            "Railway locomotive"
          ],
          "answerIndex": 0,
          "explanation": "A helicopter is listed as an aircraft type."
        },
        {
          "prompt": "Which organization may supply components?",
          "options": [
            "A supplier",
            "A passenger",
            "A runway marking",
            "A weather report"
          ],
          "answerIndex": 0,
          "explanation": "Suppliers are part of the wider aviation industry."
        },
        {
          "prompt": "Why is technical communication important?",
          "options": [
            "Different organizations depend on clear information",
            "It replaces all engineering work",
            "It removes the need for documentation",
            "It is used only in advertising"
          ],
          "answerIndex": 0,
          "explanation": "The speaker says organizations depend on clear technical communication."
        }
      ]
    },
    {
      "id": "en-c03-s01-l07",
      "title": "Course 3 · Semester 1 · Aircraft Structure: Fuselage, Wings and Control Surfaces",
      "level": "B1+–B2",
      "script": "An instructor uses a simplified aircraft diagram to introduce the main structural parts. The fuselage is the main body and provides space for the cockpit, cabin, equipment and other systems. The wings generate most of the lift in a conventional fixed-wing aircraft. The tail assembly contributes to stability and control. Ailerons are located on the wings and help control roll. The elevator is usually part of the horizontal tail and controls pitch. The rudder is part of the vertical tail and controls yaw. The instructor asks students to identify each part and describe its general function. The diagram is educational; it is not a structural repair manual or an aircraft-specific technical reference.",
      "questions": [
        {
          "prompt": "What is the fuselage?",
          "options": [
            "The main body of the aircraft",
            "A wing control surface",
            "A type of engine",
            "A landing light"
          ],
          "answerIndex": 0,
          "explanation": "The fuselage is the aircraft's main body."
        },
        {
          "prompt": "Which surfaces help control roll?",
          "options": [
            "Ailerons",
            "Elevators",
            "Rudder pedals only",
            "Flaps only"
          ],
          "answerIndex": 0,
          "explanation": "Ailerons help control roll."
        },
        {
          "prompt": "What does the elevator control?",
          "options": [
            "Pitch",
            "Yaw",
            "Cabin temperature",
            "Fuel quantity"
          ],
          "answerIndex": 0,
          "explanation": "The elevator controls pitch."
        },
        {
          "prompt": "What is the purpose of the diagram?",
          "options": [
            "Introduce general structural vocabulary",
            "Provide repair instructions",
            "Specify inspection intervals",
            "Approve a modification"
          ],
          "answerIndex": 0,
          "explanation": "It is explicitly an educational diagram."
        }
      ]
    },
    {
      "id": "en-c03-s01-l08",
      "title": "Course 3 · Semester 1 · Materials Used in Aircraft Structures",
      "level": "B1+–B2",
      "script": "A materials specialist describes several material groups used in aircraft structures. Aluminium alloys have a useful combination of strength, low density and formability. Titanium alloys can offer high strength and good performance in demanding environments, although they are more difficult and costly to process. Composite materials combine fibres and a matrix to achieve selected properties, including high stiffness and low weight. Material selection depends on loads, temperature, corrosion environment, manufacturing method, inspection requirements and approved design data. A material name alone is not enough: grade, specification, condition and traceability also matter. The specialist asks students to compare advantages and limitations without assuming that one material is suitable for every aircraft component.",
      "questions": [
        {
          "prompt": "Why are aluminium alloys widely used?",
          "options": [
            "They combine strength, low density and formability",
            "They are always the cheapest material",
            "They need no inspection",
            "They are transparent"
          ],
          "answerIndex": 0,
          "explanation": "The speaker names these three properties."
        },
        {
          "prompt": "What can composite materials combine?",
          "options": [
            "Fibres and a matrix",
            "Copper and water",
            "Glass and fuel",
            "Steel and rubber only"
          ],
          "answerIndex": 0,
          "explanation": "Composites combine fibres with a matrix."
        },
        {
          "prompt": "What else matters besides a material name?",
          "options": [
            "Grade, specification, condition and traceability",
            "Colour and packaging only",
            "The supplier's logo",
            "The component's advertising name"
          ],
          "answerIndex": 0,
          "explanation": "The recording lists these identification details."
        },
        {
          "prompt": "What determines material selection?",
          "options": [
            "Loads, environment, process and approved design data",
            "A single property only",
            "Personal preference",
            "The shortest delivery time only"
          ],
          "answerIndex": 0,
          "explanation": "Selection depends on multiple engineering factors."
        }
      ]
    },
    {
      "id": "en-c03-s01-l09",
      "title": "Course 3 · Semester 1 · Manufacturing Workflow and Process Sheets",
      "level": "B1+–B2",
      "script": "A production technologist is explaining a simplified manufacturing workflow. First, the team reviews the drawing and the approved process documentation. Next, materials and required resources are confirmed. The operation sequence is then planned and recorded on a process sheet. During production, operators follow the authorized instructions and record the required information. Inspection results are documented at the specified stages. If a discrepancy appears, it is reported through the established process rather than corrected informally. The technologist points out common document fields: operation number, description, equipment reference, responsible role and record entry. The class uses a fictional process sheet to practise reading and describing a workflow.",
      "questions": [
        {
          "prompt": "What should the team review first?",
          "options": [
            "The drawing and approved process documentation",
            "A personal notebook only",
            "An old unverified message",
            "A supplier advertisement"
          ],
          "answerIndex": 0,
          "explanation": "The workflow begins with document review."
        },
        {
          "prompt": "Where is the operation sequence recorded?",
          "options": [
            "On a process sheet",
            "On a passenger ticket",
            "In a social media post",
            "On a personal calendar"
          ],
          "answerIndex": 0,
          "explanation": "The process sheet records the sequence."
        },
        {
          "prompt": "What should happen if a discrepancy appears?",
          "options": [
            "Report it through the established process",
            "Change the record informally",
            "Ignore it",
            "Delete the process sheet"
          ],
          "answerIndex": 0,
          "explanation": "The speaker says discrepancies must be reported."
        },
        {
          "prompt": "Which field may appear on a process sheet?",
          "options": [
            "Operation number",
            "Favourite colour",
            "Personal password",
            "Holiday destination"
          ],
          "answerIndex": 0,
          "explanation": "Operation number is one of the listed fields."
        }
      ]
    },
    {
      "id": "en-c03-s01-l10",
      "title": "Course 3 · Semester 1 · Dimensions, Units and Measurement in Engineering",
      "level": "B1+–B2",
      "script": "A quality technician is checking a training drawing with a group of students. The drawing gives dimensions in millimetres, and the students must read the decimal point carefully. The technician explains that a dimension describes size or location, while a unit tells us how the value is measured. A length may be expressed in millimetres or metres. Mass may be expressed in kilograms, and temperature in degrees Celsius. Students practise saying decimal values clearly and repeating them back to confirm understanding. The technician also reminds them that a measurement result should include the value, unit, instrument identification where required and the relevant record. The exercise uses fictional dimensions, not acceptance criteria.",
      "questions": [
        {
          "prompt": "What does a unit tell us?",
          "options": [
            "How a value is measured",
            "Who designed the component",
            "Which machine made the part",
            "When the drawing was printed"
          ],
          "answerIndex": 0,
          "explanation": "A unit identifies the measurement scale."
        },
        {
          "prompt": "Which unit is commonly used for engineering length in the example?",
          "options": [
            "Millimetre",
            "Kilogram",
            "Hertz",
            "Ampere"
          ],
          "answerIndex": 0,
          "explanation": "The drawing gives dimensions in millimetres."
        },
        {
          "prompt": "Why repeat a decimal value back?",
          "options": [
            "To confirm that it was heard correctly",
            "To change the drawing revision",
            "To make the value larger",
            "To avoid recording the unit"
          ],
          "answerIndex": 0,
          "explanation": "Repeating confirms communication accuracy."
        },
        {
          "prompt": "What may a measurement record include?",
          "options": [
            "Value, unit and instrument identification",
            "Only the operator's opinion",
            "A photograph without context",
            "A component colour"
          ],
          "answerIndex": 0,
          "explanation": "The speaker lists value, unit and instrument ID."
        }
      ]
    },
    {
      "id": "en-c03-s01-l11",
      "title": "Course 3 · Semester 1 · Technical Word Formation, Abbreviations and Symbols",
      "level": "B1+–B2",
      "script": "An English teacher is helping engineering students understand technical vocabulary. Many technical words contain prefixes and suffixes. The prefix micro- refers to a very small scale, while multi- means many. The suffix -meter appears in words for measuring instruments, such as thermometer and voltmeter. Technical texts also use abbreviations, for example CAD for computer-aided design and CNC for computer numerical control. Symbols can represent units or features on drawings, but their meaning depends on the relevant standard and context. The teacher advises students not to guess an unfamiliar abbreviation from its letters alone. They should check the glossary, drawing legend or approved reference document.",
      "questions": [
        {
          "prompt": "What does the prefix multi- mean?",
          "options": [
            "Many",
            "Small",
            "Before",
            "Without"
          ],
          "answerIndex": 0,
          "explanation": "Multi- means many."
        },
        {
          "prompt": "Which suffix appears in names of measuring instruments?",
          "options": [
            "-meter",
            "-ology",
            "-less",
            "-ship"
          ],
          "answerIndex": 0,
          "explanation": "Thermometer and voltmeter illustrate -meter."
        },
        {
          "prompt": "What does CNC stand for?",
          "options": [
            "Computer numerical control",
            "Central network cable",
            "Current number calculation",
            "Control navigation chart"
          ],
          "answerIndex": 0,
          "explanation": "CNC means computer numerical control."
        },
        {
          "prompt": "Where should an unfamiliar drawing abbreviation be checked?",
          "options": [
            "In the glossary or drawing legend",
            "In an unrelated advertisement",
            "In a personal guess",
            "In a weather report"
          ],
          "answerIndex": 0,
          "explanation": "The teacher recommends the glossary, legend or approved reference."
        }
      ]
    },
    {
      "id": "en-c03-s01-l12",
      "title": "Course 3 · Semester 1 · Reading Technical Descriptions and Specification Tables",
      "level": "B1+–B2",
      "script": "A student is comparing two fictional material specification entries. The teacher explains how to read a table systematically. First, identify the column headings. Then check the material designation, condition, unit and stated property. A value in a table is meaningful only when its unit and context are clear. Notes may contain limitations or references to another document. The student should not compare values from different test conditions as if they were equivalent. The teacher asks the class to summarize the main difference in two sentences and to cite the table row used. This activity develops technical reading skills; the fictional table is not an approved material specification.",
      "questions": [
        {
          "prompt": "What should a reader identify first?",
          "options": [
            "The column headings",
            "The page number only",
            "The font style",
            "The author's photograph"
          ],
          "answerIndex": 0,
          "explanation": "The teacher says to begin with column headings."
        },
        {
          "prompt": "Why is the unit important?",
          "options": [
            "A value needs its unit and context",
            "Units are optional decoration",
            "Units identify the author",
            "A unit replaces the material designation"
          ],
          "answerIndex": 0,
          "explanation": "The unit is necessary to interpret the value."
        },
        {
          "prompt": "Can values from different test conditions always be compared directly?",
          "options": [
            "No",
            "Yes, always",
            "Only if they are rounded",
            "Only if the table has colours"
          ],
          "answerIndex": 0,
          "explanation": "Different test conditions may make values non-equivalent."
        },
        {
          "prompt": "What should the student include in the summary?",
          "options": [
            "The main difference and the table row used",
            "A personal guess",
            "An unrelated quotation",
            "Only the table title"
          ],
          "answerIndex": 0,
          "explanation": "The teacher asks for a two-sentence summary citing the row."
        }
      ]
    },
    {
      "id": "en-c03-s02-l01",
      "title": "Course 3 · Semester 2 · Turning, Shaping and Drilling",
      "level": "B1+–B2",
      "script": "A workshop instructor introduces three machine-tool operations. Turning is commonly performed on a lathe, where the workpiece rotates while a cutting tool removes material. In shaping, a single-point tool moves back and forth across the workpiece. Drilling produces a round hole with a rotating drill. The instructor asks students to focus on the relationship between the tool and the workpiece. In turning, the workpiece rotates; in drilling, the drill rotates; in shaping, the tool has a reciprocating movement. Students match operation names to simplified diagrams. The lesson describes general principles only and does not give machine settings or instructions for operating equipment.",
      "questions": [
        {
          "prompt": "Which part normally rotates during turning?",
          "options": [
            "The workpiece",
            "The workshop door",
            "The measuring scale",
            "The operator's chair"
          ],
          "answerIndex": 0,
          "explanation": "The workpiece rotates on a lathe."
        },
        {
          "prompt": "What movement is typical of shaping?",
          "options": [
            "Back-and-forth movement of a single-point tool",
            "Continuous movement of a passenger aircraft",
            "A wireless signal",
            "A circular movement of the whole workshop"
          ],
          "answerIndex": 0,
          "explanation": "The shaping tool moves back and forth."
        },
        {
          "prompt": "What does drilling produce?",
          "options": [
            "A round hole",
            "A flat sheet",
            "A threaded cable",
            "A network connection"
          ],
          "answerIndex": 0,
          "explanation": "Drilling produces a round hole."
        },
        {
          "prompt": "What is the lesson's boundary?",
          "options": [
            "General principles, not machine operating instructions",
            "Exact machine parameters",
            "A production approval",
            "A repair procedure"
          ],
          "answerIndex": 0,
          "explanation": "The script explicitly avoids machine settings and operating instructions."
        }
      ]
    },
    {
      "id": "en-c03-s02-l02",
      "title": "Course 3 · Semester 2 · Milling, Grinding, Pressing and Band Sawing",
      "level": "B1+–B2",
      "script": "A manufacturing tutor compares four workshop processes. Milling removes material with a rotating multi-edge cutter. Grinding uses an abrasive wheel to remove small amounts of material and improve a surface. A press applies force to form or cut material using suitable tooling. A band saw uses a continuous toothed blade to cut stock. The tutor asks students to identify the main tool in each process and describe the action with verbs such as rotate, abrade, press and cut. The class also discusses why process choice depends on material, shape, required finish and production plan. The recording is a vocabulary exercise, not a machine setup or safety procedure.",
      "questions": [
        {
          "prompt": "Which process uses a rotating multi-edge cutter?",
          "options": [
            "Milling",
            "Grinding",
            "Pressing",
            "Band sawing"
          ],
          "answerIndex": 0,
          "explanation": "Milling uses a rotating multi-edge cutter."
        },
        {
          "prompt": "What does grinding use?",
          "options": [
            "An abrasive wheel",
            "A network router",
            "A welding cable",
            "A plastic mould only"
          ],
          "answerIndex": 0,
          "explanation": "Grinding uses an abrasive wheel."
        },
        {
          "prompt": "What applies force to form or cut material?",
          "options": [
            "A press",
            "A band saw",
            "A caliper",
            "A CAD screen"
          ],
          "answerIndex": 0,
          "explanation": "A press applies force using tooling."
        },
        {
          "prompt": "Which verb is associated with grinding?",
          "options": [
            "Abrade",
            "Transmit",
            "Calculate",
            "Archive"
          ],
          "answerIndex": 0,
          "explanation": "Abrade describes material removal by an abrasive wheel."
        }
      ]
    },
    {
      "id": "en-c03-s02-l03",
      "title": "Course 3 · Semester 2 · Computer Numerical Control (CNC)",
      "level": "B1+–B2",
      "script": "A teacher introduces computer numerical control, or CNC. A CNC machine uses a computer-based control system to coordinate machine movements and operations. A part program contains instructions that describe selected movements or functions. The control system interprets the program and coordinates the machine according to its configuration. CNC equipment can improve repeatability and support complex shapes, but the quality of the result depends on many factors, including the program, tooling, workholding, machine condition and verification. Students compare the terms machine tool, controller, part program and workpiece. They are reminded that classroom examples are for reading and vocabulary only, not for loading or running a machine.",
      "questions": [
        {
          "prompt": "What does CNC stand for?",
          "options": [
            "Computer numerical control",
            "Central network communication",
            "Calculated number code",
            "Computer navigation chart"
          ],
          "answerIndex": 0,
          "explanation": "CNC stands for computer numerical control."
        },
        {
          "prompt": "What does a part program describe?",
          "options": [
            "Selected movements or functions",
            "The operator's lunch break",
            "A supplier's bank details",
            "The weather conditions"
          ],
          "answerIndex": 0,
          "explanation": "A part program contains instructions for movements or functions."
        },
        {
          "prompt": "What can CNC support?",
          "options": [
            "Repeatability and complex shapes",
            "Automatic approval of every component",
            "The removal of all inspection",
            "Operation without a verified program"
          ],
          "answerIndex": 0,
          "explanation": "The recording mentions repeatability and complex shapes."
        },
        {
          "prompt": "What is the purpose of classroom code examples?",
          "options": [
            "Reading and vocabulary practice",
            "Loading a production machine",
            "Changing machine parameters",
            "Approving a finished part"
          ],
          "answerIndex": 0,
          "explanation": "The teacher limits examples to reading and vocabulary."
        }
      ]
    },
    {
      "id": "en-c03-s02-l04",
      "title": "Course 3 · Semester 2 · Health and Safety Regulations in the Workshop",
      "level": "B1+–B2",
      "script": "A safety coordinator is speaking to a new student group. Before entering a workshop, students must complete the required induction and understand the local rules. Personal protective equipment depends on the task and the risk assessment. Walkways must be kept clear, and damaged tools or equipment must be reported. Students must never remove guards or bypass safety devices. If they see an unsafe condition, they should stop, keep clear and inform the responsible person according to the site's procedure. The coordinator explains that safety rules are not optional and that local instructions take priority. This recording teaches safety language; it does not replace the institution's formal induction or risk assessment.",
      "questions": [
        {
          "prompt": "What must students complete before entering the workshop?",
          "options": [
            "The required induction",
            "A production order",
            "A network installation",
            "A material certificate"
          ],
          "answerIndex": 0,
          "explanation": "The coordinator says students must complete induction."
        },
        {
          "prompt": "What determines the required PPE?",
          "options": [
            "The task and risk assessment",
            "The student's favourite colour",
            "The machine's brand name only",
            "The time of day"
          ],
          "answerIndex": 0,
          "explanation": "PPE depends on task and risk assessment."
        },
        {
          "prompt": "What should students do with damaged equipment?",
          "options": [
            "Report it",
            "Hide it",
            "Continue using it",
            "Remove its safety label"
          ],
          "answerIndex": 0,
          "explanation": "Damaged equipment must be reported."
        },
        {
          "prompt": "What should happen if an unsafe condition is noticed?",
          "options": [
            "Stop, keep clear and inform the responsible person",
            "Ignore it",
            "Attempt an unauthorized repair",
            "Ask another student to bypass a guard"
          ],
          "answerIndex": 0,
          "explanation": "The coordinator describes stopping and reporting."
        }
      ]
    },
    {
      "id": "en-c03-s02-l05",
      "title": "Course 3 · Semester 2 · Safety Rules and Protective Equipment",
      "level": "B1+–B2",
      "script": "A workshop supervisor explains that personal protective equipment is selected according to hazards. Safety glasses protect the eyes from specified risks, while hearing protection may be required in noisy areas. Safety footwear protects the feet from certain impact or compression hazards. Gloves are not suitable for every machine task; they may create additional risks around rotating equipment. Long hair must be secured and loose clothing avoided where it could become caught. Students must follow local instructions and never assume that PPE makes an unsafe action acceptable. The supervisor asks students to practise phrases such as keep clear, do not operate and report the hazard. The recording is general training and does not replace local rules.",
      "questions": [
        {
          "prompt": "How should PPE be selected?",
          "options": [
            "According to hazards and task requirements",
            "According to fashion",
            "By choosing the most expensive item",
            "The same for every activity"
          ],
          "answerIndex": 0,
          "explanation": "PPE is selected according to hazards."
        },
        {
          "prompt": "Why may gloves be unsuitable around some rotating equipment?",
          "options": [
            "They may create an additional entanglement risk",
            "They always reduce visibility",
            "They change the machine speed",
            "They prevent all injuries"
          ],
          "answerIndex": 0,
          "explanation": "The supervisor warns of risks around rotating equipment."
        },
        {
          "prompt": "What should be done with long hair?",
          "options": [
            "Secure it",
            "Leave it loose",
            "Cover it with a scarf that can catch",
            "Ignore the local rule"
          ],
          "answerIndex": 0,
          "explanation": "Long hair must be secured."
        },
        {
          "prompt": "Does PPE make an unsafe action acceptable?",
          "options": [
            "No",
            "Yes",
            "Only during training",
            "Only when a supervisor is absent"
          ],
          "answerIndex": 0,
          "explanation": "The supervisor explicitly says PPE does not justify unsafe actions."
        }
      ]
    },
    {
      "id": "en-c03-s02-l06",
      "title": "Course 3 · Semester 2 · CNC Machine Components and Setup Vocabulary",
      "level": "B1+–B2",
      "script": "A technical instructor points to a simplified CNC machine diagram. The machine has a control panel, an enclosure, a spindle, axes of movement and a workholding device. The tool is held in a toolholder, while the workpiece is secured in a suitable fixture or chuck, depending on the machine type. The instructor explains that setup information is documented and checked by authorized personnel. Students learn the words spindle, axis, enclosure, fixture and toolholder, and practise describing where each component is located. The diagram is generic and does not identify a particular machine model. It is not a setup checklist and must not be used to prepare real equipment.",
      "questions": [
        {
          "prompt": "What is the spindle associated with?",
          "options": [
            "Rotation and tooling",
            "The operator's identification card",
            "A network switch",
            "A drawing revision"
          ],
          "answerIndex": 0,
          "explanation": "The spindle is associated with rotation and tooling."
        },
        {
          "prompt": "What is a fixture used for?",
          "options": [
            "Securing or locating a workpiece",
            "Displaying a software menu",
            "Measuring room temperature",
            "Transmitting a radio signal"
          ],
          "answerIndex": 0,
          "explanation": "A fixture helps secure or locate the workpiece."
        },
        {
          "prompt": "Where are setup details documented?",
          "options": [
            "In approved setup information",
            "In an informal chat only",
            "On a random website",
            "On the machine enclosure with no control"
          ],
          "answerIndex": 0,
          "explanation": "The instructor says setup information is documented and checked."
        },
        {
          "prompt": "Can this generic diagram be used as a real setup checklist?",
          "options": [
            "No",
            "Yes, for every machine",
            "Only for aircraft components",
            "Only if printed"
          ],
          "answerIndex": 0,
          "explanation": "The script says it is not a setup checklist."
        }
      ]
    },
    {
      "id": "en-c03-s02-l07",
      "title": "Course 3 · Semester 2 · Machine Axes, Coordinates and Reference Points",
      "level": "B1+–B2",
      "script": "A student is learning how a CNC machine describes movement. The instructor explains that machine axes are commonly identified by letters such as X, Y and Z, although the actual arrangement depends on the machine configuration. Coordinates describe a position relative to a defined reference system. A work coordinate system may be used to describe the part location, while the machine coordinate system refers to the machine's own reference. The terms origin, positive direction, negative direction and reference point are introduced. The instructor emphasizes that students must not assume that axis directions are identical on every machine. The exercise uses a paper diagram and does not instruct students to set machine zero or move real equipment.",
      "questions": [
        {
          "prompt": "Which letters commonly identify linear machine axes?",
          "options": [
            "X, Y and Z",
            "A, B and C only",
            "L, M and N",
            "P, Q and R"
          ],
          "answerIndex": 0,
          "explanation": "X, Y and Z are common axis labels."
        },
        {
          "prompt": "What do coordinates describe?",
          "options": [
            "A position relative to a reference system",
            "The age of the machine",
            "The material price",
            "The operator's work schedule"
          ],
          "answerIndex": 0,
          "explanation": "Coordinates define position relative to a reference."
        },
        {
          "prompt": "What does a work coordinate system describe?",
          "options": [
            "The part location in a defined reference system",
            "The machine's electricity bill",
            "The tool supplier's address",
            "The workshop temperature"
          ],
          "answerIndex": 0,
          "explanation": "It is used to describe the part location."
        },
        {
          "prompt": "Are axis directions identical on every machine?",
          "options": [
            "No, they depend on machine configuration",
            "Yes, always",
            "Only on older machines",
            "Only on machines with a display"
          ],
          "answerIndex": 0,
          "explanation": "The instructor warns against assuming identical directions."
        }
      ]
    },
    {
      "id": "en-c03-s02-l08",
      "title": "Course 3 · Semester 2 · G-code: Reading Basic Program Blocks and Comments",
      "level": "B1+–B2",
      "script": "A programming teacher displays a short, non-executable training example to explain how CNC program text is organized. A program is divided into blocks, and each block may contain address letters and values. The letter N may identify a block number. G and M words have different groups of functions, while axis letters can be followed by coordinate values. Comments provide human-readable notes and are often enclosed in brackets, depending on the control format. The teacher asks students to identify the block number, a comment and the general role of an address letter. The example is deliberately incomplete and must not be loaded into a machine. Real programs require machine-specific verification and authorized procedures.",
      "questions": [
        {
          "prompt": "What may the letter N identify?",
          "options": [
            "A block number",
            "A material grade",
            "A network node",
            "A measurement unit"
          ],
          "answerIndex": 0,
          "explanation": "N may identify a block number."
        },
        {
          "prompt": "What are comments used for?",
          "options": [
            "Human-readable notes",
            "Automatic material approval",
            "Measuring spindle speed",
            "Replacing every program block"
          ],
          "answerIndex": 0,
          "explanation": "Comments provide explanatory notes."
        },
        {
          "prompt": "Why is the example deliberately incomplete?",
          "options": [
            "It is for reading practice and must not be run",
            "It is a certified production program",
            "It is a machine repair procedure",
            "It contains approved production parameters"
          ],
          "answerIndex": 0,
          "explanation": "The teacher explicitly says it must not be loaded."
        },
        {
          "prompt": "Do real CNC programs require machine-specific verification?",
          "options": [
            "Yes",
            "No",
            "Only if they contain comments",
            "Only if they are printed"
          ],
          "answerIndex": 0,
          "explanation": "The teacher emphasizes machine-specific verification."
        }
      ]
    },
    {
      "id": "en-c03-s02-l09",
      "title": "Course 3 · Semester 2 · Cutting Tools, Tool Wear and Tool Data",
      "level": "B1+–B2",
      "script": "A process engineer is reviewing a training chart about cutting tools. Different operations use different tool geometries and materials. A cutting edge gradually wears during use, and wear can affect surface quality, dimensions and process stability. Tool data may include a tool identifier, type, material, geometry and approved reference information. Students learn to distinguish tool wear from sudden tool damage. The engineer explains that an unusual sound, visible damage or unexpected result must be reported according to the workshop procedure. The class practises describing a tool condition with neutral language and recording observations. The chart is fictional and does not specify cutting speeds, feeds or replacement limits.",
      "questions": [
        {
          "prompt": "What can tool wear affect?",
          "options": [
            "Surface quality and dimensions",
            "The drawing title only",
            "The network password",
            "The room lighting"
          ],
          "answerIndex": 0,
          "explanation": "The recording names surface quality and dimensions."
        },
        {
          "prompt": "What may tool data include?",
          "options": [
            "Tool identifier, type, material and geometry",
            "Operator's home address",
            "Weather conditions",
            "Student grades"
          ],
          "answerIndex": 0,
          "explanation": "These are listed examples of tool data."
        },
        {
          "prompt": "How is tool wear different from tool damage?",
          "options": [
            "Wear develops gradually; damage may be sudden",
            "They are always identical",
            "Wear only affects software",
            "Damage is always invisible"
          ],
          "answerIndex": 0,
          "explanation": "The lesson distinguishes gradual wear from sudden damage."
        },
        {
          "prompt": "What should happen if an unusual result appears?",
          "options": [
            "Report it according to the workshop procedure",
            "Change parameters without authorization",
            "Ignore it",
            "Delete the observation"
          ],
          "answerIndex": 0,
          "explanation": "The engineer says unusual conditions must be reported."
        }
      ]
    },
    {
      "id": "en-c03-s02-l10",
      "title": "Course 3 · Semester 2 · Tolerances, Fits and Surface Finish",
      "level": "B1+–B2",
      "script": "A quality tutor explains that a nominal dimension is the target value shown on a drawing, while a tolerance defines the permitted variation. A fit describes the relationship between two mating parts, such as a shaft and a hole. Depending on the design, a fit may provide clearance, interference or a transition between the two. Surface finish describes the condition of a surface and may be specified using a symbol and a parameter. Students practise reading the vocabulary in a fictional specification table. The tutor warns that tolerance values and surface requirements must be taken from the current approved drawing or specification, not guessed from a similar component.",
      "questions": [
        {
          "prompt": "What does a tolerance define?",
          "options": [
            "Permitted variation from a nominal dimension",
            "The component's colour",
            "The number of production shifts",
            "The material supplier"
          ],
          "answerIndex": 0,
          "explanation": "Tolerance defines permitted variation."
        },
        {
          "prompt": "What does a fit describe?",
          "options": [
            "The relationship between mating parts",
            "The shape of a network",
            "The quality of a spoken presentation",
            "The machine's electricity supply"
          ],
          "answerIndex": 0,
          "explanation": "A fit describes the relationship between mating parts."
        },
        {
          "prompt": "Which fit type may provide clearance?",
          "options": [
            "Clearance fit",
            "Interference fit only",
            "Transition fit only",
            "No fit"
          ],
          "answerIndex": 0,
          "explanation": "Clearance fit is one of the fit categories."
        },
        {
          "prompt": "Where should actual tolerance values be taken from?",
          "options": [
            "The current approved drawing or specification",
            "A similar part from memory",
            "An informal message",
            "A general internet comment"
          ],
          "answerIndex": 0,
          "explanation": "The tutor warns not to guess values."
        }
      ]
    },
    {
      "id": "en-c03-s02-l11",
      "title": "Course 3 · Semester 2 · Measuring Instruments and First-piece Inspection",
      "level": "B1+–B2",
      "script": "A quality inspector describes a training exercise involving a first-piece inspection. The inspector identifies the characteristic to be checked and selects an appropriate measuring instrument according to the inspection plan. A caliper can measure several external, internal and depth dimensions within its range. A micrometer is used for more precise dimensional measurements in its intended range. A dial indicator can show small changes in position or runout when used in a suitable setup. The inspector records the measured value, unit, instrument identification and result. If a value is unclear or outside the stated requirement, the part is held for review and the issue is reported. The exercise uses fictional values and is not an acceptance procedure.",
      "questions": [
        {
          "prompt": "What should determine the instrument selection?",
          "options": [
            "The characteristic and inspection plan",
            "The instrument's colour",
            "The operator's preference only",
            "The component's packaging"
          ],
          "answerIndex": 0,
          "explanation": "Instrument choice is based on the characteristic and plan."
        },
        {
          "prompt": "What can a caliper measure?",
          "options": [
            "External, internal and depth dimensions",
            "Only electrical current",
            "Only surface temperature",
            "Only network speed"
          ],
          "answerIndex": 0,
          "explanation": "The recording lists these measurement types."
        },
        {
          "prompt": "What does a dial indicator show?",
          "options": [
            "Small changes in position or runout",
            "Material chemical composition",
            "Electrical frequency",
            "Document revision history"
          ],
          "answerIndex": 0,
          "explanation": "A dial indicator can show small positional changes or runout."
        },
        {
          "prompt": "What happens if a result is unclear or outside the requirement?",
          "options": [
            "The part is held for review and the issue is reported",
            "The value is changed to fit",
            "The record is deleted",
            "The part is automatically approved"
          ],
          "answerIndex": 0,
          "explanation": "The inspector describes holding and reporting."
        }
      ]
    },
    {
      "id": "en-c03-s02-l12",
      "title": "Course 3 · Semester 2 · Workshop Handover, Safety Briefings and Stop-work Language",
      "level": "B1+–B2",
      "script": "Two technicians are handing over a training job at the end of a shift. The first technician summarizes the task status, documents reviewed, work completed and any outstanding questions. The second technician repeats the key points to confirm understanding. They identify a tool that has been tagged for inspection and agree that it must not be used until the responsible person has reviewed it. During the briefing, one technician notices that a guard appears loose. They stop the activity, keep clear and report the condition. The instructor highlights clear phrases: do not operate, keep clear, this needs checking and please confirm. The scenario is a communication exercise, not a substitute for local stop-work procedures.",
      "questions": [
        {
          "prompt": "What information is included in the handover?",
          "options": [
            "Task status, documents reviewed and outstanding questions",
            "Personal opinions only",
            "The next shift's private details",
            "A list of unrelated websites"
          ],
          "answerIndex": 0,
          "explanation": "The technician summarizes task status and open points."
        },
        {
          "prompt": "Why does the second technician repeat key points?",
          "options": [
            "To confirm understanding",
            "To change the task without agreement",
            "To avoid making a record",
            "To shorten the safety briefing"
          ],
          "answerIndex": 0,
          "explanation": "Repeating confirms that the information was understood."
        },
        {
          "prompt": "What happens when a loose guard is noticed?",
          "options": [
            "Stop, keep clear and report it",
            "Continue working carefully",
            "Remove the guard",
            "Ask an untrained person to repair it"
          ],
          "answerIndex": 0,
          "explanation": "The scenario models stopping and reporting."
        },
        {
          "prompt": "Which phrase is suitable for a safety warning?",
          "options": [
            "Do not operate",
            "It probably looks fine",
            "Ignore the label",
            "Carry on regardless"
          ],
          "answerIndex": 0,
          "explanation": "Do not operate is a clear stop-work phrase."
        }
      ]
    },
      {
      "id": "en-c02-s01-l01",
      "title": "Course 2 · Semester 1 · Participles, Gerunds and Infinitives",
      "level": "B1–B1+",
      "script": "A student is talking to her teacher about learning English. She enjoys reading short articles and listening to podcasts because these activities help her remember new words. She wants to improve her speaking, so she has decided to practise every day. Her teacher suggests writing down useful phrases and trying to use them in conversation. The student agrees that learning a language takes time, but she is happy to continue.",
      "questions": [
        {
          "prompt": "What does the student enjoy?",
          "options": [
            "Reading and listening",
            "Only writing tests",
            "Watching films without sound",
            "Memorising numbers"
          ],
          "answerIndex": 0,
          "explanation": "She enjoys reading articles and listening to podcasts."
        },
        {
          "prompt": "Why does she listen to podcasts?",
          "options": [
            "To remember new words",
            "To avoid speaking",
            "To learn mathematics",
            "To prepare a meal"
          ],
          "answerIndex": 0,
          "explanation": "She says these activities help her remember vocabulary."
        },
        {
          "prompt": "What does she want to improve?",
          "options": [
            "Speaking",
            "Drawing",
            "Driving",
            "Cooking"
          ],
          "answerIndex": 0,
          "explanation": "She wants to improve her speaking."
        },
        {
          "prompt": "What does the teacher suggest?",
          "options": [
            "Write useful phrases and use them",
            "Stop listening to English",
            "Translate every word",
            "Study only once a month"
          ],
          "answerIndex": 0,
          "explanation": "The teacher suggests recording and using useful phrases."
        }
      ]
    },
    {
      "id": "en-c02-s01-l02",
      "title": "Course 2 · Semester 1 · Reading: Tatarstan",
      "level": "B1–B1+",
      "script": "A visitor is preparing a short presentation about Tatarstan. She explains that the republic is located in the Volga region of Russia and has a rich cultural history. Kazan is its capital and an important educational and cultural centre. People use Russian and Tatar in everyday life. The visitor also mentions industry, agriculture and modern universities. She wants her classmates to understand that a region can combine historical traditions with new technology and education.",
      "questions": [
        {
          "prompt": "Where is Tatarstan located?",
          "options": [
            "In the Volga region of Russia",
            "In the Arctic Ocean",
            "In Central Africa",
            "On the island of Sicily"
          ],
          "answerIndex": 0,
          "explanation": "The speaker places Tatarstan in the Volga region."
        },
        {
          "prompt": "What is the capital of Tatarstan?",
          "options": [
            "Kazan",
            "Moscow",
            "Samara",
            "Sochi"
          ],
          "answerIndex": 0,
          "explanation": "Kazan is named as the capital."
        },
        {
          "prompt": "Which languages are mentioned?",
          "options": [
            "Russian and Tatar",
            "English and French",
            "German and Spanish",
            "Chinese and Japanese"
          ],
          "answerIndex": 0,
          "explanation": "The speaker mentions Russian and Tatar."
        },
        {
          "prompt": "What does the presentation compare?",
          "options": [
            "Traditions and modern development",
            "Two sports teams",
            "Different planets",
            "Types of cooking"
          ],
          "answerIndex": 0,
          "explanation": "It describes traditions together with technology and education."
        }
      ]
    },
    {
      "id": "en-c02-s01-l03",
      "title": "Course 2 · Semester 1 · Reading: Dealing with People",
      "level": "B1–B1+",
      "script": "A college student has a problem with a group project. One team member often arrives late, and another does not answer messages. The student decides to speak to them politely instead of complaining. She explains what the group needs and asks everyone to agree on a simple schedule. They listen to each other and divide the tasks more clearly. The project becomes easier because everyone knows what to do and when to finish it.",
      "questions": [
        {
          "prompt": "What is the problem in the group?",
          "options": [
            "Some members do not communicate or arrive on time",
            "The classroom is closed",
            "The project has no topic",
            "The teacher has lost the books"
          ],
          "answerIndex": 0,
          "explanation": "The speaker describes lateness and unanswered messages."
        },
        {
          "prompt": "What does the student decide to do?",
          "options": [
            "Speak politely to the group",
            "Leave the project immediately",
            "Send an angry public message",
            "Do all the work alone"
          ],
          "answerIndex": 0,
          "explanation": "She chooses a polite conversation."
        },
        {
          "prompt": "What do they agree on?",
          "options": [
            "A simple schedule",
            "A new college building",
            "A sports competition",
            "A holiday trip"
          ],
          "answerIndex": 0,
          "explanation": "They agree on a schedule."
        },
        {
          "prompt": "Why does the project become easier?",
          "options": [
            "Everyone understands their tasks and deadlines",
            "The project is cancelled",
            "Nobody has to communicate",
            "The deadline disappears"
          ],
          "answerIndex": 0,
          "explanation": "Clear task division helps the group."
        }
      ]
    },
    {
      "id": "en-c02-s01-l04",
      "title": "Course 2 · Semester 1 · Future Forms: Plans and Predictions",
      "level": "B1–B1+",
      "script": "Two friends are discussing their plans for the next year. Lena is going to apply for a technical course because she wants to learn more about electronics. Her friend has already arranged a summer placement at a local company. They think technology will create new opportunities, but they know that success will require effort. They are meeting the college adviser next week to ask about applications and practical training.",
      "questions": [
        {
          "prompt": "What is Lena going to apply for?",
          "options": [
            "A technical course",
            "A cooking competition",
            "A driving licence",
            "A music festival"
          ],
          "answerIndex": 0,
          "explanation": "She plans to apply for a technical course."
        },
        {
          "prompt": "What has her friend arranged?",
          "options": [
            "A summer placement",
            "A winter holiday",
            "A new apartment",
            "A language exam"
          ],
          "answerIndex": 0,
          "explanation": "The friend has arranged a summer placement."
        },
        {
          "prompt": "What do they think technology will create?",
          "options": [
            "New opportunities",
            "Fewer subjects",
            "Longer holidays",
            "No changes"
          ],
          "answerIndex": 0,
          "explanation": "They expect new opportunities."
        },
        {
          "prompt": "Who are they meeting next week?",
          "options": [
            "The college adviser",
            "A sports coach",
            "A travel guide",
            "A shop assistant"
          ],
          "answerIndex": 0,
          "explanation": "They plan to meet the college adviser."
        }
      ]
    },
    {
      "id": "en-c02-s01-l05",
      "title": "Course 2 · Semester 1 · Comparatives and Describing Change",
      "level": "B1–B1+",
      "script": "A teacher compares two ways of studying. Reading a short text on paper is sometimes easier for students who want to underline important details. Digital materials are more convenient when students need to search quickly or study away from college. Neither method is always better. The teacher says that the best choice depends on the task. She asks the class to compare the advantages and disadvantages and give examples from their own experience.",
      "questions": [
        {
          "prompt": "What can be easier with a paper text?",
          "options": [
            "Underlining important details",
            "Searching thousands of files",
            "Sending an email",
            "Changing a screen setting"
          ],
          "answerIndex": 0,
          "explanation": "The teacher says paper can make underlining easier."
        },
        {
          "prompt": "When are digital materials more convenient?",
          "options": [
            "When searching quickly or studying away",
            "When no device is available",
            "When students need to draw on paper",
            "When the internet is forbidden"
          ],
          "answerIndex": 0,
          "explanation": "Digital materials help with quick searching and remote study."
        },
        {
          "prompt": "Does the teacher say one method is always better?",
          "options": [
            "No",
            "Yes",
            "Only paper is better",
            "Only digital is better"
          ],
          "answerIndex": 0,
          "explanation": "She says the best choice depends on the task."
        },
        {
          "prompt": "What does she ask students to do?",
          "options": [
            "Compare advantages and disadvantages",
            "Memorise the text word for word",
            "Stop using both methods",
            "Write a shopping list"
          ],
          "answerIndex": 0,
          "explanation": "Students should compare both approaches."
        }
      ]
    },
    {
      "id": "en-c02-s01-l06",
      "title": "Course 2 · Semester 1 · Modal Verbs: Advice and Obligation",
      "level": "B1–B1+",
      "script": "A college tutor is giving advice before a practical lesson. Students must wear the required protective equipment and follow the workshop rules. They should read the task sheet before starting and ask questions if something is unclear. They can work in pairs during the planning stage, but they must not operate equipment without permission. The tutor says that asking for help is a sign of responsibility, not weakness.",
      "questions": [
        {
          "prompt": "What must students wear?",
          "options": [
            "Required protective equipment",
            "A uniform from another college",
            "Sports clothes only",
            "No special clothing"
          ],
          "answerIndex": 0,
          "explanation": "The tutor says required PPE must be worn."
        },
        {
          "prompt": "What should students read before starting?",
          "options": [
            "The task sheet",
            "A travel brochure",
            "A restaurant menu",
            "A newspaper about sport"
          ],
          "answerIndex": 0,
          "explanation": "They should read the task sheet."
        },
        {
          "prompt": "When can they work in pairs?",
          "options": [
            "During the planning stage",
            "When operating equipment without permission",
            "During an emergency",
            "Only after the lesson"
          ],
          "answerIndex": 0,
          "explanation": "Pair work is allowed during planning."
        },
        {
          "prompt": "What does the tutor say about asking for help?",
          "options": [
            "It shows responsibility",
            "It is a weakness",
            "It is forbidden",
            "It wastes everyone's time"
          ],
          "answerIndex": 0,
          "explanation": "The tutor encourages asking questions."
        }
      ]
    },
    {
      "id": "en-c02-s01-l07",
      "title": "Course 2 · Semester 1 · Education Systems and Lifelong Learning",
      "level": "B1–B1+",
      "script": "A careers adviser explains that education does not end when a student receives a diploma. People continue learning through short courses, workplace training, online lessons and professional qualifications. Some skills become outdated as technology changes, so workers need to update their knowledge. The adviser recommends setting realistic goals and choosing courses that match a person's work or career plans. Lifelong learning can help people adapt to new tasks and responsibilities.",
      "questions": [
        {
          "prompt": "When does learning end, according to the adviser?",
          "options": [
            "It does not end with a diploma",
            "At the age of eighteen",
            "After the first job",
            "After one online course"
          ],
          "answerIndex": 0,
          "explanation": "The adviser says learning continues after graduation."
        },
        {
          "prompt": "Why do workers need to update their knowledge?",
          "options": [
            "Technology and job requirements change",
            "Books become illegal",
            "All jobs stay the same",
            "Training is always compulsory every day"
          ],
          "answerIndex": 0,
          "explanation": "Skills can become outdated as technology changes."
        },
        {
          "prompt": "What should course choices match?",
          "options": [
            "Work or career plans",
            "A random advertisement",
            "A friend's timetable only",
            "The weather"
          ],
          "answerIndex": 0,
          "explanation": "Courses should fit goals and career plans."
        },
        {
          "prompt": "What can lifelong learning help people do?",
          "options": [
            "Adapt to new tasks",
            "Avoid all responsibility",
            "Stop communicating",
            "Guarantee an easy job"
          ],
          "answerIndex": 0,
          "explanation": "It helps people adapt to changing tasks."
        }
      ]
    },
    {
      "id": "en-c02-s01-l08",
      "title": "Course 2 · Semester 1 · Professions, Skills and Career Choices",
      "level": "B1–B1+",
      "script": "A student is choosing between several technical professions. She enjoys solving practical problems and working carefully with information. Her teacher explains that different jobs require different combinations of skills. A technologist plans and improves production processes. A programmer develops and tests software. An electrician works with electrical systems, while a machine-tool operator works with equipment and manufacturing tasks. The student decides to learn more about each profession before choosing her pathway.",
      "questions": [
        {
          "prompt": "What does the student enjoy?",
          "options": [
            "Solving practical problems",
            "Performing on stage",
            "Selling clothes",
            "Cooking meals"
          ],
          "answerIndex": 0,
          "explanation": "She enjoys practical problem-solving."
        },
        {
          "prompt": "What does a technologist do?",
          "options": [
            "Plans and improves production processes",
            "Writes novels",
            "Repairs mobile phones only",
            "Teaches history only"
          ],
          "answerIndex": 0,
          "explanation": "The teacher describes a technologist's role."
        },
        {
          "prompt": "What does a programmer develop and test?",
          "options": [
            "Software",
            "Metal sheets",
            "Electrical cables only",
            "Food products"
          ],
          "answerIndex": 0,
          "explanation": "Programmers develop and test software."
        },
        {
          "prompt": "What does the student decide to do?",
          "options": [
            "Learn more about each profession",
            "Choose without information",
            "Change colleges immediately",
            "Ignore the teacher"
          ],
          "answerIndex": 0,
          "explanation": "She wants to research the professions first."
        }
      ]
    },
    {
      "id": "en-c02-s01-l09",
      "title": "Course 2 · Semester 1 · A First CV",
      "level": "B1–B1+",
      "script": "A student is preparing a first CV for a summer placement. She includes her contact details, education, practical skills and a short personal profile. She has no full-time work experience, so she describes college projects and volunteer activities. Her teacher advises her to use clear headings, correct dates and action verbs. The CV should be honest and easy to read. The student checks spelling and saves the document as a PDF before sending it.",
      "questions": [
        {
          "prompt": "What is the student applying for?",
          "options": [
            "A summer placement",
            "A university scholarship abroad",
            "A sports team",
            "A driving test"
          ],
          "answerIndex": 0,
          "explanation": "She is preparing a CV for a summer placement."
        },
        {
          "prompt": "What does she include instead of full-time work experience?",
          "options": [
            "College projects and volunteering",
            "Invented job titles",
            "Personal passwords",
            "Unrelated family information"
          ],
          "answerIndex": 0,
          "explanation": "She describes projects and volunteer activities."
        },
        {
          "prompt": "What does the teacher recommend?",
          "options": [
            "Clear headings and correct dates",
            "Long paragraphs with no headings",
            "Unverified information",
            "Decorative fonts only"
          ],
          "answerIndex": 0,
          "explanation": "The teacher recommends clear structure and accurate dates."
        },
        {
          "prompt": "What file format does she save?",
          "options": [
            "PDF",
            "MP3",
            "JPEG",
            "ZIP only"
          ],
          "answerIndex": 0,
          "explanation": "She saves the CV as a PDF."
        }
      ]
    },
    {
      "id": "en-c02-s01-l10",
      "title": "Course 2 · Semester 1 · Communication at Work: Requests and Clarification",
      "level": "B1–B1+",
      "script": "A trainee is helping prepare a work area but does not understand one instruction. Instead of guessing, he asks, Could you explain the last step, please? The supervisor repeats the instruction and shows the relevant section of the task sheet. The trainee repeats the key information to check that he has understood. The supervisor says that polite questions prevent mistakes and save time. They agree to check unclear details before continuing.",
      "questions": [
        {
          "prompt": "What does the trainee not understand?",
          "options": [
            "One instruction",
            "The college timetable",
            "The bus route",
            "The lunch menu"
          ],
          "answerIndex": 0,
          "explanation": "He does not understand one instruction."
        },
        {
          "prompt": "What does he do instead of guessing?",
          "options": [
            "Asks a polite question",
            "Continues without checking",
            "Changes the task",
            "Leaves the workplace"
          ],
          "answerIndex": 0,
          "explanation": "He asks for clarification."
        },
        {
          "prompt": "What does the supervisor show him?",
          "options": [
            "The relevant section of the task sheet",
            "A holiday photograph",
            "A sports result",
            "A shopping receipt"
          ],
          "answerIndex": 0,
          "explanation": "The supervisor points to the task sheet."
        },
        {
          "prompt": "Why are polite questions useful?",
          "options": [
            "They prevent mistakes and save time",
            "They make tasks longer",
            "They replace documentation",
            "They avoid teamwork"
          ],
          "answerIndex": 0,
          "explanation": "The supervisor explains their value."
        }
      ]
    },
    {
      "id": "en-c02-s01-l11",
      "title": "Course 2 · Semester 1 · Travel, Transport and Travel Problems",
      "level": "B1–B1+",
      "script": "A student is travelling to a college competition by train. At the station, she hears an announcement that the service is delayed because of a technical problem. She checks the information board and asks a member of staff about the next connection. The employee explains that another train will leave from a different platform. The student sends a message to her teacher to explain that she may arrive late. She keeps her ticket and follows the updated information.",
      "questions": [
        {
          "prompt": "Where is the student travelling?",
          "options": [
            "To a college competition",
            "To a hospital appointment",
            "To a family wedding",
            "To a music lesson"
          ],
          "answerIndex": 0,
          "explanation": "She is travelling to a college competition."
        },
        {
          "prompt": "Why is the train delayed?",
          "options": [
            "A technical problem",
            "Heavy snow",
            "A missing ticket",
            "A sports event"
          ],
          "answerIndex": 0,
          "explanation": "The announcement mentions a technical problem."
        },
        {
          "prompt": "Where does the next train leave from?",
          "options": [
            "A different platform",
            "The same platform immediately",
            "The airport",
            "A bus stop"
          ],
          "answerIndex": 0,
          "explanation": "The employee says it leaves from a different platform."
        },
        {
          "prompt": "Who does the student message?",
          "options": [
            "Her teacher",
            "A hotel manager",
            "A shop assistant",
            "A taxi driver"
          ],
          "answerIndex": 0,
          "explanation": "She informs her teacher that she may be late."
        }
      ]
    },
    {
      "id": "en-c02-s01-l12",
      "title": "Course 2 · Semester 1 · Reading Strategies: Main Idea and Detail",
      "level": "B1–B1+",
      "script": "A student reads a short article about a new college laboratory. First, she reads the title and opening paragraph to understand the main idea. Then she looks for specific information, such as the opening date, the equipment available and the courses that will use the laboratory. She does not translate every word. When she meets an unfamiliar word, she uses the surrounding sentence to guess its meaning and checks the glossary later. This helps her read more efficiently.",
      "questions": [
        {
          "prompt": "What does the student read first?",
          "options": [
            "The title and opening paragraph",
            "The last footnote",
            "Every word in a dictionary",
            "Only the picture captions"
          ],
          "answerIndex": 0,
          "explanation": "She begins with the title and opening paragraph."
        },
        {
          "prompt": "What information does she look for?",
          "options": [
            "Opening date and available equipment",
            "The author's home address",
            "The colour of the website",
            "Unrelated news"
          ],
          "answerIndex": 0,
          "explanation": "She scans for specific details."
        },
        {
          "prompt": "Does she translate every word?",
          "options": [
            "No",
            "Yes",
            "Only the title",
            "Only the numbers"
          ],
          "answerIndex": 0,
          "explanation": "She does not translate every word."
        },
        {
          "prompt": "How does she guess an unfamiliar word?",
          "options": [
            "From the surrounding sentence",
            "From its font size",
            "From a random number",
            "By ignoring the whole paragraph"
          ],
          "answerIndex": 0,
          "explanation": "She uses context to infer meaning."
        }
      ]
    },
    {
      "id": "en-c02-s02-l01",
      "title": "Course 2 · Semester 2 · Conditionals and Reported Speech",
      "level": "B1–B1+",
      "script": "A student tells her friend about a conversation with a teacher. The teacher said that if students planned their work carefully, they would have more time for revision. She also explained that if someone missed a lesson, they should check the online materials and ask about any important changes. The student reports the advice to her friend and says that good planning can reduce stress before exams.",
      "questions": [
        {
          "prompt": "What did the teacher recommend?",
          "options": [
            "Planning work carefully",
            "Avoiding revision",
            "Missing lessons",
            "Studying only the night before"
          ],
          "answerIndex": 0,
          "explanation": "The teacher recommends careful planning."
        },
        {
          "prompt": "What should a student do after missing a lesson?",
          "options": [
            "Check online materials and ask about changes",
            "Ignore the lesson",
            "Delete the timetable",
            "Wait until the exam"
          ],
          "answerIndex": 0,
          "explanation": "The teacher gives two steps."
        },
        {
          "prompt": "What can good planning reduce?",
          "options": [
            "Stress before exams",
            "The number of subjects",
            "The length of the school year",
            "The need for sleep"
          ],
          "answerIndex": 0,
          "explanation": "The student says planning can reduce exam stress."
        },
        {
          "prompt": "What is the student doing?",
          "options": [
            "Reporting the teacher's advice",
            "Giving a weather forecast",
            "Describing a machine",
            "Ordering a meal"
          ],
          "answerIndex": 0,
          "explanation": "She reports what the teacher said."
        }
      ]
    },
    {
      "id": "en-c02-s02-l02",
      "title": "Course 2 · Semester 2 · Reading: Environmental Protection",
      "level": "B1–B1+",
      "script": "A college group is planning an environmental campaign. They discuss saving electricity, sorting waste and using less paper. One student suggests putting clear labels on recycling containers. Another proposes switching off lights and equipment when they are not needed. The group also wants to explain that small actions are more effective when many people take part. They prepare posters and a short announcement for the college website.",
      "questions": [
        {
          "prompt": "What is the group planning?",
          "options": [
            "An environmental campaign",
            "A music concert",
            "A sports tournament",
            "A new restaurant"
          ],
          "answerIndex": 0,
          "explanation": "They are planning an environmental campaign."
        },
        {
          "prompt": "What does one student suggest for recycling containers?",
          "options": [
            "Clear labels",
            "New locks",
            "More advertising",
            "Different colours of walls"
          ],
          "answerIndex": 0,
          "explanation": "The student suggests clear labels."
        },
        {
          "prompt": "What should people switch off?",
          "options": [
            "Lights and unused equipment",
            "All computers during lessons",
            "The heating in winter always",
            "The college website"
          ],
          "answerIndex": 0,
          "explanation": "The group discusses saving electricity."
        },
        {
          "prompt": "When are small actions more effective?",
          "options": [
            "When many people take part",
            "When only one person acts",
            "When nobody notices",
            "When the campaign ends"
          ],
          "answerIndex": 0,
          "explanation": "The students say participation makes actions more effective."
        }
      ]
    },
    {
      "id": "en-c02-s02-l03",
      "title": "Course 2 · Semester 2 · Reading: The Speed Limit",
      "level": "B1–B1+",
      "script": "A driving instructor explains why speed limits are important. A safe speed depends on the road, traffic, visibility and weather conditions. The posted limit is a maximum, not a target that drivers must always reach. In heavy rain or poor visibility, a driver may need to travel more slowly. The instructor asks students to read road signs carefully and leave enough distance from the vehicle ahead. Responsible driving means adjusting speed to the conditions.",
      "questions": [
        {
          "prompt": "What does a posted speed limit represent?",
          "options": [
            "A maximum",
            "A minimum target",
            "A recommended speed in every condition",
            "A distance"
          ],
          "answerIndex": 0,
          "explanation": "The instructor says it is a maximum."
        },
        {
          "prompt": "When may a driver need to slow down?",
          "options": [
            "In heavy rain or poor visibility",
            "On every empty road",
            "Only during daylight",
            "When the radio is on"
          ],
          "answerIndex": 0,
          "explanation": "Weather and visibility affect safe speed."
        },
        {
          "prompt": "What should drivers leave?",
          "options": [
            "Enough distance from the vehicle ahead",
            "No space at all",
            "Their documents at home",
            "The road without looking"
          ],
          "answerIndex": 0,
          "explanation": "The instructor stresses following distance."
        },
        {
          "prompt": "What is responsible driving?",
          "options": [
            "Adjusting speed to conditions",
            "Always driving at the maximum",
            "Ignoring road signs",
            "Following another car very closely"
          ],
          "answerIndex": 0,
          "explanation": "The instructor defines it as adapting to conditions."
        }
      ]
    },
    {
      "id": "en-c02-s02-l04",
      "title": "Course 2 · Semester 2 · The History of Physics",
      "level": "B1–B1+",
      "script": "A teacher is preparing a short lesson about the history of physics. Early scientists observed motion, light and the stars. Over time, experiments and mathematical models helped people explain natural phenomena. Classical mechanics described many everyday movements, while later discoveries changed ideas about electricity, atoms and energy. The teacher explains that scientific knowledge develops when researchers test ideas, compare evidence and revise explanations. Students are asked to identify the main stages rather than memorize every date.",
      "questions": [
        {
          "prompt": "What did early scientists observe?",
          "options": [
            "Motion, light and the stars",
            "Only modern computers",
            "The internet",
            "Factory timetables"
          ],
          "answerIndex": 0,
          "explanation": "These observations are named in the recording."
        },
        {
          "prompt": "What helped people explain natural phenomena?",
          "options": [
            "Experiments and mathematical models",
            "Advertising and rumours",
            "Travel tickets",
            "Social media comments"
          ],
          "answerIndex": 0,
          "explanation": "The teacher mentions experiments and models."
        },
        {
          "prompt": "What did later discoveries change?",
          "options": [
            "Ideas about electricity, atoms and energy",
            "The length of the week",
            "The names of continents",
            "The college uniform"
          ],
          "answerIndex": 0,
          "explanation": "These scientific ideas are listed."
        },
        {
          "prompt": "What should students focus on?",
          "options": [
            "Main stages of development",
            "Every date in detail",
            "Unrelated biographies",
            "Only the lesson title"
          ],
          "answerIndex": 0,
          "explanation": "The teacher says to identify the main stages."
        }
      ]
    },
    {
      "id": "en-c02-s02-l05",
      "title": "Course 2 · Semester 2 · The Revolution in Physics",
      "level": "B1–B1+",
      "script": "A science teacher explains that new discoveries sometimes change accepted scientific ideas. Research into atoms and very small particles showed that classical physics could not explain every observation. New theories provided different models for understanding matter and energy. The teacher emphasizes that scientific theories are not simply guesses; they are explanations supported by evidence and tested against observations. Students discuss why scientists need to remain open to new results while checking claims carefully.",
      "questions": [
        {
          "prompt": "Why did new theories develop?",
          "options": [
            "Classical physics could not explain every observation",
            "Scientists stopped doing experiments",
            "All old books disappeared",
            "Technology became unnecessary"
          ],
          "answerIndex": 0,
          "explanation": "The teacher says classical physics had limits."
        },
        {
          "prompt": "What do scientific theories provide?",
          "options": [
            "Models for understanding matter and energy",
            "Personal opinions without evidence",
            "A list of college rules",
            "A machine operating schedule"
          ],
          "answerIndex": 0,
          "explanation": "The theories offer explanatory models."
        },
        {
          "prompt": "Are scientific theories simply guesses?",
          "options": [
            "No",
            "Yes",
            "Only in history",
            "Only in school"
          ],
          "answerIndex": 0,
          "explanation": "The teacher distinguishes theories from unsupported guesses."
        },
        {
          "prompt": "What should scientists do with new results?",
          "options": [
            "Remain open and check claims carefully",
            "Accept every claim immediately",
            "Ignore evidence",
            "Avoid experiments"
          ],
          "answerIndex": 0,
          "explanation": "The teacher advises openness and careful checking."
        }
      ]
    },
    {
      "id": "en-c02-s02-l06",
      "title": "Course 2 · Semester 2 · Automation",
      "level": "B1–B1+",
      "script": "A factory guide describes how automation changes production. Some tasks are performed by machines or computer-controlled systems, while people plan the process, monitor results and solve problems. Automation can make repeated operations more consistent and help collect production data. However, systems still need maintenance, correct information and trained staff. The guide explains that automation does not mean that people are no longer important. It changes the skills workers need and creates new responsibilities.",
      "questions": [
        {
          "prompt": "What can perform some production tasks?",
          "options": [
            "Machines and computer-controlled systems",
            "Only handwritten notes",
            "Passenger vehicles",
            "Printed posters"
          ],
          "answerIndex": 0,
          "explanation": "The guide describes machines and computer-controlled systems."
        },
        {
          "prompt": "What do people still do?",
          "options": [
            "Plan, monitor and solve problems",
            "Leave all decisions to machines",
            "Avoid learning new skills",
            "Stop checking results"
          ],
          "answerIndex": 0,
          "explanation": "People remain involved in planning and problem-solving."
        },
        {
          "prompt": "What can automation improve?",
          "options": [
            "Consistency and data collection",
            "The weather",
            "The size of every component",
            "The number of holidays"
          ],
          "answerIndex": 0,
          "explanation": "The speaker mentions consistency and production data."
        },
        {
          "prompt": "Does automation make people unimportant?",
          "options": [
            "No",
            "Yes",
            "Only in large factories",
            "Only in small workshops"
          ],
          "answerIndex": 0,
          "explanation": "The guide says people remain important."
        }
      ]
    },
    {
      "id": "en-c02-s02-l07",
      "title": "Course 2 · Semester 2 · Environmental Pollution",
      "level": "B1–B1+",
      "script": "A student is preparing a report about pollution. She explains that air pollution can come from transport, industry and heating. Water pollution may be caused by waste, chemicals or oil entering rivers and lakes. Noise pollution affects people and animals, especially in busy urban areas. The student says that prevention is important: companies should follow environmental rules, communities should reduce waste and people should use resources responsibly. She ends by saying that reliable information is needed before proposing solutions.",
      "questions": [
        {
          "prompt": "Which source of air pollution is mentioned?",
          "options": [
            "Transport",
            "Library books",
            "School uniforms",
            "Musical instruments"
          ],
          "answerIndex": 0,
          "explanation": "Transport is one of the sources named."
        },
        {
          "prompt": "What can cause water pollution?",
          "options": [
            "Waste, chemicals or oil",
            "Clean rainwater only",
            "Paper labels",
            "Solar panels"
          ],
          "answerIndex": 0,
          "explanation": "The speaker lists waste, chemicals and oil."
        },
        {
          "prompt": "Who should help prevent pollution?",
          "options": [
            "Companies, communities and individuals",
            "Only tourists",
            "Only children",
            "No one"
          ],
          "answerIndex": 0,
          "explanation": "The report describes shared responsibility."
        },
        {
          "prompt": "What is needed before proposing solutions?",
          "options": [
            "Reliable information",
            "A guess",
            "An advertisement",
            "A personal preference"
          ],
          "answerIndex": 0,
          "explanation": "The student stresses reliable information."
        }
      ]
    },
    {
      "id": "en-c02-s02-l08",
      "title": "Course 2 · Semester 2 · Passive Voice in Scientific Texts",
      "level": "B1–B1+",
      "script": "A student is reading a short description of a laboratory experiment. The equipment is checked before the experiment begins. The sample is placed in a container, and the temperature is recorded at regular intervals. After the experiment, the results are compared with the initial prediction. The teacher explains that scientific texts often use the passive voice because the process or result is more important than the person performing the action. Students practise changing active sentences into passive sentences.",
      "questions": [
        {
          "prompt": "What is checked before the experiment?",
          "options": [
            "The equipment",
            "The weather forecast",
            "The classroom timetable",
            "The student's phone"
          ],
          "answerIndex": 0,
          "explanation": "The text says the equipment is checked."
        },
        {
          "prompt": "Where is the sample placed?",
          "options": [
            "In a container",
            "On a bus",
            "In a library",
            "Under a desk"
          ],
          "answerIndex": 0,
          "explanation": "The sample is placed in a container."
        },
        {
          "prompt": "When is the temperature recorded?",
          "options": [
            "At regular intervals",
            "Only before the lesson",
            "Once a year",
            "After the report is printed"
          ],
          "answerIndex": 0,
          "explanation": "The recording says it is recorded regularly."
        },
        {
          "prompt": "Why is passive voice common in scientific texts?",
          "options": [
            "The process or result is often more important",
            "The author is unknown in every case",
            "It makes every sentence shorter",
            "It replaces all technical words"
          ],
          "answerIndex": 0,
          "explanation": "The teacher explains the focus on process or result."
        }
      ]
    },
    {
      "id": "en-c02-s02-l09",
      "title": "Course 2 · Semester 2 · Linking Words and Coherent Paragraphs",
      "level": "B1–B1+",
      "script": "A student is writing a paragraph about renewable energy. She begins with the main idea, then adds examples. She uses because to give a reason, however to introduce a contrast and therefore to show a result. Her teacher asks her to organize the ideas in a logical order and avoid repeating the same linking word in every sentence. The final paragraph is easier to follow because each sentence has a clear connection with the next one.",
      "questions": [
        {
          "prompt": "What is the student writing about?",
          "options": [
            "Renewable energy",
            "A travel diary",
            "A sports match",
            "A cooking recipe"
          ],
          "answerIndex": 0,
          "explanation": "The topic is renewable energy."
        },
        {
          "prompt": "Which word introduces a reason?",
          "options": [
            "Because",
            "However",
            "Therefore",
            "Finally"
          ],
          "answerIndex": 0,
          "explanation": "Because introduces a reason."
        },
        {
          "prompt": "Which word introduces contrast?",
          "options": [
            "However",
            "Because",
            "Therefore",
            "For example"
          ],
          "answerIndex": 0,
          "explanation": "However introduces contrast."
        },
        {
          "prompt": "Why is the final paragraph easier to follow?",
          "options": [
            "The ideas are logically connected",
            "It has no examples",
            "Every sentence is identical",
            "It contains no linking words"
          ],
          "answerIndex": 0,
          "explanation": "Logical links improve coherence."
        }
      ]
    },
    {
      "id": "en-c02-s02-l10",
      "title": "Course 2 · Semester 2 · Climate, Resources and Sustainable Development",
      "level": "B1–B1+",
      "script": "A lecturer explains sustainable development to a college group. It means meeting people's needs today while protecting the ability of future generations to meet their needs. Energy, water, forests and minerals are limited resources, so they should be used responsibly. Renewable energy can reduce dependence on fossil fuels, but every energy source has advantages and limitations. The lecturer asks students to compare solutions and consider environmental, social and economic factors.",
      "questions": [
        {
          "prompt": "What does sustainable development try to protect?",
          "options": [
            "The needs of future generations",
            "Only short-term profits",
            "One type of transport",
            "A single industry"
          ],
          "answerIndex": 0,
          "explanation": "The definition includes future generations."
        },
        {
          "prompt": "Which resource is mentioned?",
          "options": [
            "Water",
            "Plastic toys",
            "Mobile phone apps",
            "Road signs"
          ],
          "answerIndex": 0,
          "explanation": "Water is one of the listed resources."
        },
        {
          "prompt": "Does every energy source have only advantages?",
          "options": [
            "No",
            "Yes",
            "Only renewable sources do",
            "Only fossil fuels do"
          ],
          "answerIndex": 0,
          "explanation": "The lecturer says every source has advantages and limitations."
        },
        {
          "prompt": "Which factors should students consider?",
          "options": [
            "Environmental, social and economic",
            "Only fashion",
            "Only distance",
            "Only advertising"
          ],
          "answerIndex": 0,
          "explanation": "The lecturer names three factors."
        }
      ]
    },
    {
      "id": "en-c02-s02-l11",
      "title": "Course 2 · Semester 2 · Science and Technology in Everyday Life",
      "level": "B1–B1+",
      "script": "A student describes how technology is used in everyday life. Smartphones help people communicate, maps support navigation and digital payment systems make shopping faster. Medical equipment helps doctors monitor patients, while sensors can measure temperature and movement in homes and factories. The student adds that technology also creates responsibilities: people should protect personal information, check sources and use devices safely. The class discusses how technology can be useful when people understand both its benefits and its risks.",
      "questions": [
        {
          "prompt": "What can digital maps support?",
          "options": [
            "Navigation",
            "Cooking",
            "Metal casting",
            "Laundry"
          ],
          "answerIndex": 0,
          "explanation": "The speaker says maps support navigation."
        },
        {
          "prompt": "What can sensors measure?",
          "options": [
            "Temperature and movement",
            "Personal opinions",
            "Book titles",
            "The price of food"
          ],
          "answerIndex": 0,
          "explanation": "Sensors can measure physical conditions."
        },
        {
          "prompt": "What responsibility is mentioned?",
          "options": [
            "Protect personal information",
            "Share every password",
            "Believe every website",
            "Ignore device safety"
          ],
          "answerIndex": 0,
          "explanation": "The student mentions privacy and safe use."
        },
        {
          "prompt": "When is technology most useful?",
          "options": [
            "When people understand benefits and risks",
            "When people never check information",
            "When devices are used without care",
            "When all decisions are automatic"
          ],
          "answerIndex": 0,
          "explanation": "The class considers benefits and risks."
        }
      ]
    },
    {
      "id": "en-c02-s02-l12",
      "title": "Course 2 · Semester 2 · Expressing an Opinion: Short Presentation",
      "level": "B1–B1+",
      "script": "A student is giving a short presentation about practical training. She believes that practical tasks help students connect theory with real situations. First, she gives her opinion. Then she provides two reasons and an example from a college project. She also mentions a possible disadvantage: practical work takes time and requires careful preparation. In conclusion, she says that practical learning is valuable when it is well organized and supported by clear instructions.",
      "questions": [
        {
          "prompt": "What is the presentation about?",
          "options": [
            "Practical training",
            "Online shopping",
            "A sports event",
            "A family holiday"
          ],
          "answerIndex": 0,
          "explanation": "The student discusses practical training."
        },
        {
          "prompt": "How does she support her opinion?",
          "options": [
            "With reasons and an example",
            "With unrelated jokes",
            "With a list of names",
            "With no explanation"
          ],
          "answerIndex": 0,
          "explanation": "She gives two reasons and a project example."
        },
        {
          "prompt": "What disadvantage does she mention?",
          "options": [
            "Practical work takes time and preparation",
            "It never helps students",
            "It is always unsafe",
            "It requires no instructions"
          ],
          "answerIndex": 0,
          "explanation": "She notes time and preparation."
        },
        {
          "prompt": "What is her conclusion?",
          "options": [
            "Practical learning is valuable when well organized",
            "Practical work should stop",
            "Theory is never useful",
            "Instructions are unnecessary"
          ],
          "answerIndex": 0,
          "explanation": "She gives a balanced conclusion."
        }
      ]
    },
      {
      "id": "en-c01-s01-l01",
      "title": "Course 1 · Semester 1 · Phonetics and Pronunciation",
      "level": "A1–A2",
      "script": "Teacher: Good morning, everyone. Today we will practise the English sounds in ship and sheep. Listen first: ship, sheep. Student: They sound similar, but the vowel is different. Teacher: Good. Now repeat: sit, seat; live, leave. Do not worry if it is difficult at first. Listen carefully, speak slowly and practise a little every day.",
      "questions": [
        {
          "prompt": "Which words does the teacher compare first?",
          "options": [
            "Ship and sheep",
            "Sit and stand",
            "Live and love",
            "Good and morning"
          ],
          "answerIndex": 0,
          "explanation": "The first pair is ship and sheep."
        },
        {
          "prompt": "What is different in the words?",
          "options": [
            "The vowel sound",
            "The number of letters",
            "The first consonant",
            "The meaning of teacher"
          ],
          "answerIndex": 0,
          "explanation": "The teacher focuses on the vowel."
        },
        {
          "prompt": "What does the teacher ask students to do?",
          "options": [
            "Listen carefully and speak slowly",
            "Speak as fast as possible",
            "Stop practising",
            "Write only numbers"
          ],
          "answerIndex": 0,
          "explanation": "The teacher recommends careful listening and slow speech."
        },
        {
          "prompt": "Which pair is mentioned next?",
          "options": [
            "Sit and seat",
            "Cat and dog",
            "Red and blue",
            "Book and pen"
          ],
          "answerIndex": 0,
          "explanation": "The teacher says sit and seat."
        }
      ]
    },
    {
      "id": "en-c01-s01-l02",
      "title": "Course 1 · Semester 1 · Pronouns, Verbs and Modal Verbs",
      "level": "A1–A2",
      "script": "Hello. My name is Alex. I am a first-year student. My group is friendly, and our teacher is helpful. We study English on Monday. I can read simple texts, but I cannot speak quickly yet. Our teacher says, You should practise every day. We must bring our notebooks to class. I like English because it helps me communicate with people.",
      "questions": [
        {
          "prompt": "Who is speaking?",
          "options": [
            "Alex",
            "The teacher",
            "A parent",
            "A shop assistant"
          ],
          "answerIndex": 0,
          "explanation": "The speaker introduces himself as Alex."
        },
        {
          "prompt": "When does the group study English?",
          "options": [
            "On Monday",
            "On Friday",
            "Every evening",
            "On Sunday"
          ],
          "answerIndex": 0,
          "explanation": "Alex says they study English on Monday."
        },
        {
          "prompt": "What can Alex do?",
          "options": [
            "Read simple texts",
            "Speak quickly",
            "Teach the class",
            "Write long reports"
          ],
          "answerIndex": 0,
          "explanation": "He can read simple texts."
        },
        {
          "prompt": "What must students bring?",
          "options": [
            "Their notebooks",
            "A passport",
            "A football",
            "A camera"
          ],
          "answerIndex": 0,
          "explanation": "The teacher says they must bring notebooks."
        }
      ]
    },
    {
      "id": "en-c01-s01-l03",
      "title": "Course 1 · Semester 1 · Reading: Speak About Yourself",
      "level": "A1–A2",
      "script": "Interviewer: Can you tell me about yourself? Student: My name is Maria. I am eighteen years old and I live with my family. I am a college student. I like drawing and listening to music. My favourite subject is English because I want to travel and meet new people. Interviewer: What are your plans? Student: I want to study well and find an interesting job.",
      "questions": [
        {
          "prompt": "How old is Maria?",
          "options": [
            "Eighteen",
            "Sixteen",
            "Twenty",
            "Seventeen"
          ],
          "answerIndex": 0,
          "explanation": "Maria says she is eighteen."
        },
        {
          "prompt": "Who does she live with?",
          "options": [
            "Her family",
            "Her classmates",
            "Her teacher",
            "Her friends"
          ],
          "answerIndex": 0,
          "explanation": "She lives with her family."
        },
        {
          "prompt": "What is her favourite subject?",
          "options": [
            "English",
            "Physics",
            "History",
            "Art"
          ],
          "answerIndex": 0,
          "explanation": "Maria says English is her favourite subject."
        },
        {
          "prompt": "Why does she like English?",
          "options": [
            "She wants to travel and meet people",
            "She wants to become a singer",
            "She dislikes other subjects",
            "She wants to move house"
          ],
          "answerIndex": 0,
          "explanation": "She gives travel and communication as reasons."
        }
      ]
    },
    {
      "id": "en-c01-s01-l04",
      "title": "Course 1 · Semester 1 · Classroom English: Instructions and Questions",
      "level": "A1–A2",
      "script": "Teacher: Open your books, please. Look at exercise two. Listen to the recording and choose the correct answer. Student: Excuse me, could you repeat the instruction? Teacher: Of course. Listen first, then write your answers. Student: Should we work alone? Teacher: Yes, work individually for five minutes. After that, compare your answers with a partner.",
      "questions": [
        {
          "prompt": "Which exercise should students open?",
          "options": [
            "Exercise two",
            "Exercise five",
            "Exercise ten",
            "No exercise"
          ],
          "answerIndex": 0,
          "explanation": "The teacher says exercise two."
        },
        {
          "prompt": "What should students do first?",
          "options": [
            "Listen to the recording",
            "Compare answers",
            "Close their books",
            "Leave the classroom"
          ],
          "answerIndex": 0,
          "explanation": "They should listen first."
        },
        {
          "prompt": "How long should they work individually?",
          "options": [
            "Five minutes",
            "Ten minutes",
            "One hour",
            "Two minutes"
          ],
          "answerIndex": 0,
          "explanation": "The teacher gives five minutes."
        },
        {
          "prompt": "What happens after individual work?",
          "options": [
            "They compare answers with a partner",
            "They go home",
            "They start a new course",
            "They take a bus"
          ],
          "answerIndex": 0,
          "explanation": "They compare answers after five minutes."
        }
      ]
    },
    {
      "id": "en-c01-s01-l05",
      "title": "Course 1 · Semester 1 · Present Simple: Facts and Habits",
      "level": "A1–A2",
      "script": "My name is Dan. I live near the college. I get up at seven o'clock and have breakfast at home. I walk to the bus stop and take the bus to college. My first lesson starts at nine. I study English twice a week. In the evening, I do my homework and sometimes play computer games. I usually go to bed at eleven.",
      "questions": [
        {
          "prompt": "What time does Dan get up?",
          "options": [
            "At seven",
            "At six",
            "At eight",
            "At nine"
          ],
          "answerIndex": 0,
          "explanation": "Dan gets up at seven."
        },
        {
          "prompt": "How does he travel to college?",
          "options": [
            "By bus",
            "By train",
            "By bicycle",
            "By taxi"
          ],
          "answerIndex": 0,
          "explanation": "He takes the bus."
        },
        {
          "prompt": "How often does he study English?",
          "options": [
            "Twice a week",
            "Every day",
            "Once a month",
            "Three times a day"
          ],
          "answerIndex": 0,
          "explanation": "He studies English twice a week."
        },
        {
          "prompt": "What time does he usually go to bed?",
          "options": [
            "At eleven",
            "At nine",
            "At ten",
            "At midnight"
          ],
          "answerIndex": 0,
          "explanation": "He usually goes to bed at eleven."
        }
      ]
    },
    {
      "id": "en-c01-s01-l06",
      "title": "Course 1 · Semester 1 · Present Simple: Third-person Forms",
      "level": "A1–A2",
      "script": "Teacher: What does your brother do, Nina? Nina: He works in a workshop. He checks parts and writes short reports. Teacher: Does he work every day? Nina: Yes, he works from Monday to Friday. He does not work at the weekend. Teacher: Does he like his job? Nina: Yes, he likes it because he learns new things.",
      "questions": [
        {
          "prompt": "Where does Nina's brother work?",
          "options": [
            "In a workshop",
            "In a hospital",
            "In a shop",
            "At a hotel"
          ],
          "answerIndex": 0,
          "explanation": "He works in a workshop."
        },
        {
          "prompt": "What does he check?",
          "options": [
            "Parts",
            "Books",
            "Tickets",
            "Food"
          ],
          "answerIndex": 0,
          "explanation": "He checks parts."
        },
        {
          "prompt": "When does he work?",
          "options": [
            "From Monday to Friday",
            "Only on Sunday",
            "Every weekend",
            "Only on Monday"
          ],
          "answerIndex": 0,
          "explanation": "He works weekdays."
        },
        {
          "prompt": "Why does he like his job?",
          "options": [
            "He learns new things",
            "He never writes reports",
            "He works at night",
            "He travels every day"
          ],
          "answerIndex": 0,
          "explanation": "Nina says he likes learning."
        }
      ]
    },
    {
      "id": "en-c01-s01-l07",
      "title": "Course 1 · Semester 1 · Questions and Negatives in Present Simple",
      "level": "A1–A2",
      "script": "Receptionist: Do you study at this college? Visitor: Yes, I do. Receptionist: Do you live in the city? Visitor: No, I do not. I live in a village near the city. Receptionist: Does your bus arrive early? Visitor: No, it does not. It usually arrives at eight thirty. Receptionist: Thank you. Please wait in room twelve.",
      "questions": [
        {
          "prompt": "Does the visitor study at the college?",
          "options": [
            "Yes",
            "No",
            "The recording does not say",
            "Only on weekends"
          ],
          "answerIndex": 0,
          "explanation": "The visitor answers yes."
        },
        {
          "prompt": "Where does the visitor live?",
          "options": [
            "In a village near the city",
            "In the city centre",
            "At the college",
            "At the station"
          ],
          "answerIndex": 0,
          "explanation": "The visitor lives in a nearby village."
        },
        {
          "prompt": "What time does the bus usually arrive?",
          "options": [
            "At eight thirty",
            "At seven",
            "At nine thirty",
            "At twelve"
          ],
          "answerIndex": 0,
          "explanation": "The visitor gives eight thirty."
        },
        {
          "prompt": "Where should the visitor wait?",
          "options": [
            "In room twelve",
            "At the bus stop",
            "In the library",
            "Outside the college"
          ],
          "answerIndex": 0,
          "explanation": "The receptionist says room twelve."
        }
      ]
    },
    {
      "id": "en-c01-s01-l08",
      "title": "Course 1 · Semester 1 · Nouns, Articles and Plural Forms",
      "level": "A1–A2",
      "script": "Teacher: Look at the picture. What can you see? Student: I can see a desk, a chair and an apple. Teacher: Good. What about the books? Student: There are three books on the desk. Teacher: Is there a computer? Student: Yes, there is a computer next to the books. Teacher: Excellent. Remember: one book, two books; one box, two boxes.",
      "questions": [
        {
          "prompt": "What is on the desk?",
          "options": [
            "A desk, a chair and an apple",
            "Only a phone",
            "Two bags",
            "A bicycle"
          ],
          "answerIndex": 0,
          "explanation": "The student names a desk, chair and apple in the picture."
        },
        {
          "prompt": "How many books are there?",
          "options": [
            "Three",
            "One",
            "Two",
            "Five"
          ],
          "answerIndex": 0,
          "explanation": "The student says there are three books."
        },
        {
          "prompt": "Where is the computer?",
          "options": [
            "Next to the books",
            "Under the chair",
            "In the bag",
            "Outside"
          ],
          "answerIndex": 0,
          "explanation": "It is next to the books."
        },
        {
          "prompt": "What plural form does the teacher give?",
          "options": [
            "Boxes",
            "Boxs",
            "Boxies",
            "Boxen"
          ],
          "answerIndex": 0,
          "explanation": "The teacher says one box, two boxes."
        }
      ]
    },
    {
      "id": "en-c01-s01-l09",
      "title": "Course 1 · Semester 1 · Family, Friends and Personal Information",
      "level": "A1–A2",
      "script": "Hello, my name is Pavel. I have a small family. My mother is a nurse and my father is an engineer. I have one younger sister. She is fourteen and she likes sport. My best friend is Timur. We study in the same group and often do our homework together. At weekends, we visit our grandparents or go for a walk.",
      "questions": [
        {
          "prompt": "What is Pavel's father's job?",
          "options": [
            "Engineer",
            "Nurse",
            "Teacher",
            "Driver"
          ],
          "answerIndex": 0,
          "explanation": "His father is an engineer."
        },
        {
          "prompt": "How old is his sister?",
          "options": [
            "Fourteen",
            "Twelve",
            "Sixteen",
            "Eighteen"
          ],
          "answerIndex": 0,
          "explanation": "His sister is fourteen."
        },
        {
          "prompt": "Who is Timur?",
          "options": [
            "Pavel's best friend",
            "His brother",
            "His teacher",
            "His cousin"
          ],
          "answerIndex": 0,
          "explanation": "Pavel calls Timur his best friend."
        },
        {
          "prompt": "What do they often do together?",
          "options": [
            "Homework",
            "Shopping for cars",
            "Cooking at work",
            "Playing tennis professionally"
          ],
          "answerIndex": 0,
          "explanation": "They often do homework together."
        }
      ]
    },
    {
      "id": "en-c01-s01-l10",
      "title": "Course 1 · Semester 1 · Prepositions of Place and Time",
      "level": "A1–A2",
      "script": "Student: Where is the English classroom? Teacher: It is on the second floor, next to the computer room. Student: What time does the lesson start? Teacher: It starts at ten past nine on Tuesday. Student: Is the library open in the evening? Teacher: Yes, it is open until six o'clock. Student: Thank you. Teacher: You are welcome.",
      "questions": [
        {
          "prompt": "Where is the English classroom?",
          "options": [
            "On the second floor",
            "On the ground floor",
            "In the basement",
            "Outside the building"
          ],
          "answerIndex": 0,
          "explanation": "It is on the second floor."
        },
        {
          "prompt": "What room is next to it?",
          "options": [
            "The computer room",
            "The gym",
            "The canteen",
            "The laboratory"
          ],
          "answerIndex": 0,
          "explanation": "It is next to the computer room."
        },
        {
          "prompt": "When does the lesson start?",
          "options": [
            "At ten past nine on Tuesday",
            "At eight on Monday",
            "At ten on Friday",
            "At six in the evening"
          ],
          "answerIndex": 0,
          "explanation": "The teacher gives the exact time and day."
        },
        {
          "prompt": "When does the library close?",
          "options": [
            "At six o'clock",
            "At four o'clock",
            "At nine o'clock",
            "At midnight"
          ],
          "answerIndex": 0,
          "explanation": "It is open until six."
        }
      ]
    },
    {
      "id": "en-c01-s01-l11",
      "title": "Course 1 · Semester 1 · Daily Routines and Frequency Adverbs",
      "level": "A1–A2",
      "script": "Anna has a busy day. She usually gets up at half past six. She always has breakfast before leaving home. She sometimes walks to college when the weather is good. After lessons, she often meets her friend in the library. She rarely watches television on weekdays because she has homework. She never goes to bed before finishing her tasks.",
      "questions": [
        {
          "prompt": "What time does Anna usually get up?",
          "options": [
            "Half past six",
            "Seven thirty",
            "Six o'clock",
            "Eight"
          ],
          "answerIndex": 0,
          "explanation": "She gets up at half past six."
        },
        {
          "prompt": "What does she always do before leaving?",
          "options": [
            "Have breakfast",
            "Watch television",
            "Visit the library",
            "Call her teacher"
          ],
          "answerIndex": 0,
          "explanation": "She always has breakfast."
        },
        {
          "prompt": "Where does she often meet her friend?",
          "options": [
            "In the library",
            "At the station",
            "In a supermarket",
            "At the airport"
          ],
          "answerIndex": 0,
          "explanation": "They often meet in the library."
        },
        {
          "prompt": "Why does she rarely watch television on weekdays?",
          "options": [
            "She has homework",
            "She dislikes music",
            "She works at a hotel",
            "She goes swimming"
          ],
          "answerIndex": 0,
          "explanation": "She has homework to do."
        }
      ]
    },
    {
      "id": "en-c01-s01-l12",
      "title": "Course 1 · Semester 1 · Filling in Basic Forms",
      "level": "A1–A2",
      "script": "A college administrator is helping a new student complete a form. The student writes her surname, first name, date of birth, address and telephone number. The administrator asks her to check every number carefully. The student writes her email address and names her study group. At the end, she reads the form again and signs it. The administrator says that clear and correct information helps the college contact students.",
      "questions": [
        {
          "prompt": "What does the student write first?",
          "options": [
            "Surname and first name",
            "Favourite film",
            "Shopping list",
            "Travel plans"
          ],
          "answerIndex": 0,
          "explanation": "The form asks for surname and first name."
        },
        {
          "prompt": "Which date-related detail is required?",
          "options": [
            "Date of birth",
            "Date of a holiday",
            "Date of a concert",
            "Date of a football match"
          ],
          "answerIndex": 0,
          "explanation": "Date of birth is requested."
        },
        {
          "prompt": "What should the student check carefully?",
          "options": [
            "Every number",
            "The classroom colour",
            "The weather",
            "The teacher's shoes"
          ],
          "answerIndex": 0,
          "explanation": "The administrator asks her to check numbers."
        },
        {
          "prompt": "What does the student do at the end?",
          "options": [
            "Reads the form again and signs it",
            "Throws the form away",
            "Leaves it blank",
            "Sends it to a shop"
          ],
          "answerIndex": 0,
          "explanation": "She reviews and signs the form."
        }
      ]
    },
    {
      "id": "en-c01-s02-l01",
      "title": "Course 1 · Semester 2 · Word Formation and Definitions",
      "level": "A1–A2",
      "script": "Teacher: What is a driver? Student: A person who drives a car, bus or lorry. Teacher: Good. What is a painter? Student: A person who paints pictures or walls. Teacher: And what is a reader? Student: A person who reads. Teacher: Excellent. Many English nouns for people end in -er. Listen to the word and think about the action.",
      "questions": [
        {
          "prompt": "What is a driver?",
          "options": [
            "A person who drives",
            "A person who cooks",
            "A person who paints",
            "A person who reads"
          ],
          "answerIndex": 0,
          "explanation": "A driver is a person who drives."
        },
        {
          "prompt": "What can a painter paint?",
          "options": [
            "Pictures or walls",
            "Only books",
            "Only cars",
            "Only food"
          ],
          "answerIndex": 0,
          "explanation": "The student says pictures or walls."
        },
        {
          "prompt": "What does a reader do?",
          "options": [
            "Reads",
            "Drives",
            "Builds",
            "Sings"
          ],
          "answerIndex": 0,
          "explanation": "A reader reads."
        },
        {
          "prompt": "Which ending is mentioned?",
          "options": [
            "-er",
            "-ing",
            "-ful",
            "-less"
          ],
          "answerIndex": 0,
          "explanation": "The teacher highlights -er."
        }
      ]
    },
    {
      "id": "en-c01-s02-l02",
      "title": "Course 1 · Semester 2 · Reading: Nizhnekamsk",
      "level": "A1–A2",
      "script": "A student is describing Nizhnekamsk to a new classmate. It is a city in the Republic of Tatarstan. The city has residential areas, schools, parks and sports facilities. Industry is important to the local economy, and many people work at large enterprises or in service organizations. The student likes the city because it has places to study, meet friends and spend free time.",
      "questions": [
        {
          "prompt": "Where is Nizhnekamsk?",
          "options": [
            "In the Republic of Tatarstan",
            "In the Republic of Karelia",
            "In the south of Spain",
            "On the coast of France"
          ],
          "answerIndex": 0,
          "explanation": "The student says it is in Tatarstan."
        },
        {
          "prompt": "What facilities are mentioned?",
          "options": [
            "Schools, parks and sports facilities",
            "Only airports",
            "Only museums",
            "Only factories"
          ],
          "answerIndex": 0,
          "explanation": "The speaker lists schools, parks and sports facilities."
        },
        {
          "prompt": "What is important to the local economy?",
          "options": [
            "Industry",
            "Fishing only",
            "Tourism only",
            "Film production"
          ],
          "answerIndex": 0,
          "explanation": "Industry is described as important."
        },
        {
          "prompt": "Why does the student like the city?",
          "options": [
            "It has places to study and spend free time",
            "There are no schools",
            "It has no traffic",
            "It is always quiet"
          ],
          "answerIndex": 0,
          "explanation": "The student mentions study, friends and leisure."
        }
      ]
    },
    {
      "id": "en-c01-s02-l03",
      "title": "Course 1 · Semester 2 · Reading: A Machine Should Work",
      "level": "A1–A2",
      "script": "A student visits a workshop with a teacher. The teacher explains that a machine is designed to perform a particular task. Before work begins, the operator checks the work area and follows the instructions. If a machine makes an unusual noise or stops unexpectedly, the operator must report the problem. Students should never touch controls without permission. The teacher says that machines are useful when people understand their purpose and use them responsibly.",
      "questions": [
        {
          "prompt": "Why is a machine designed?",
          "options": [
            "To perform a particular task",
            "To decorate a room",
            "To replace every worker",
            "To store books"
          ],
          "answerIndex": 0,
          "explanation": "The teacher says a machine performs a particular task."
        },
        {
          "prompt": "What should happen before work begins?",
          "options": [
            "The work area is checked",
            "The controls are changed",
            "The machine is painted",
            "The operator leaves"
          ],
          "answerIndex": 0,
          "explanation": "The teacher mentions checking the work area."
        },
        {
          "prompt": "What should the operator do if there is an unusual noise?",
          "options": [
            "Report the problem",
            "Ignore it",
            "Increase the speed",
            "Ask a visitor to fix it"
          ],
          "answerIndex": 0,
          "explanation": "The operator must report unusual conditions."
        },
        {
          "prompt": "Can students touch controls without permission?",
          "options": [
            "No",
            "Yes",
            "Only at lunchtime",
            "Only when alone"
          ],
          "answerIndex": 0,
          "explanation": "The teacher says not to touch controls without permission."
        }
      ]
    },
    {
      "id": "en-c01-s02-l04",
      "title": "Course 1 · Semester 2 · My College: Departments and People",
      "level": "A1–A2",
      "script": "A new student is visiting the college. A guide explains that the main building has classrooms, laboratories, a library and a sports hall. The technology department is on the first floor, and the language classrooms are on the second floor. Students can ask the receptionist for help. Teachers work in department offices, while the librarian helps students find books and digital resources.",
      "questions": [
        {
          "prompt": "What is in the main building?",
          "options": [
            "Classrooms, laboratories, a library and a sports hall",
            "Only offices",
            "Only a canteen",
            "Only workshops"
          ],
          "answerIndex": 0,
          "explanation": "The guide lists four facilities."
        },
        {
          "prompt": "Where is the technology department?",
          "options": [
            "On the first floor",
            "On the second floor",
            "In the basement",
            "Outside"
          ],
          "answerIndex": 0,
          "explanation": "It is on the first floor."
        },
        {
          "prompt": "Where are the language classrooms?",
          "options": [
            "On the second floor",
            "On the first floor",
            "In the sports hall",
            "In the library"
          ],
          "answerIndex": 0,
          "explanation": "They are on the second floor."
        },
        {
          "prompt": "Who helps students find books?",
          "options": [
            "The librarian",
            "The receptionist",
            "The sports coach",
            "The bus driver"
          ],
          "answerIndex": 0,
          "explanation": "The librarian helps with books and resources."
        }
      ]
    },
    {
      "id": "en-c01-s02-l05",
      "title": "Course 1 · Semester 2 · Subjects, Timetables and Classroom Language",
      "level": "A1–A2",
      "script": "A student checks her timetable for Wednesday. The first lesson is mathematics at eight thirty. After a short break, the group has English at ten fifteen. In the afternoon, they study materials science in a laboratory. The student writes the room numbers in her notebook. She asks a classmate to explain the abbreviation for the laboratory building. Her classmate shows her the timetable key.",
      "questions": [
        {
          "prompt": "What is the first lesson?",
          "options": [
            "Mathematics",
            "English",
            "Materials science",
            "History"
          ],
          "answerIndex": 0,
          "explanation": "Mathematics is first."
        },
        {
          "prompt": "When does English begin?",
          "options": [
            "At ten fifteen",
            "At eight thirty",
            "At eleven thirty",
            "At two o'clock"
          ],
          "answerIndex": 0,
          "explanation": "The timetable gives ten fifteen."
        },
        {
          "prompt": "Where do they study materials science?",
          "options": [
            "In a laboratory",
            "In the library",
            "In the sports hall",
            "Outside"
          ],
          "answerIndex": 0,
          "explanation": "The afternoon lesson is in a laboratory."
        },
        {
          "prompt": "Where does the classmate find the abbreviation meaning?",
          "options": [
            "In the timetable key",
            "In a restaurant menu",
            "On a bus ticket",
            "In a phone game"
          ],
          "answerIndex": 0,
          "explanation": "The classmate shows the timetable key."
        }
      ]
    },
    {
      "id": "en-c01-s02-l06",
      "title": "Course 1 · Semester 2 · Places in Town and Giving Directions",
      "level": "A1–A2",
      "script": "Visitor: Excuse me, how can I get to the railway station? Local resident: Go straight along this street and turn left at the bank. The station is opposite the post office. Visitor: Is it far? Local resident: No, it is about a ten-minute walk. Visitor: Thank you. Local resident: You are welcome. Be careful when you cross the road.",
      "questions": [
        {
          "prompt": "Where does the visitor want to go?",
          "options": [
            "The railway station",
            "The airport",
            "The library",
            "The hospital"
          ],
          "answerIndex": 0,
          "explanation": "The visitor asks for the railway station."
        },
        {
          "prompt": "Where should the visitor turn left?",
          "options": [
            "At the bank",
            "At the school",
            "At the park",
            "At the cinema"
          ],
          "answerIndex": 0,
          "explanation": "The directions say turn left at the bank."
        },
        {
          "prompt": "What is opposite the station?",
          "options": [
            "The post office",
            "The bank",
            "The college",
            "The museum"
          ],
          "answerIndex": 0,
          "explanation": "The station is opposite the post office."
        },
        {
          "prompt": "How long is the walk?",
          "options": [
            "About ten minutes",
            "Two minutes",
            "Half an hour",
            "One hour"
          ],
          "answerIndex": 0,
          "explanation": "The local resident says ten minutes."
        }
      ]
    },
    {
      "id": "en-c01-s02-l07",
      "title": "Course 1 · Semester 2 · Public Services and Everyday Situations",
      "level": "A1–A2",
      "script": "A student needs to send a parcel. At the post office, she asks for a small box and a form. The assistant explains that she must write the receiver's name and address clearly. The student asks how much the service costs. The assistant checks the parcel size and gives the price. The student pays by card and keeps the receipt.",
      "questions": [
        {
          "prompt": "Where does the student go?",
          "options": [
            "The post office",
            "The library",
            "The hospital",
            "The railway station"
          ],
          "answerIndex": 0,
          "explanation": "She goes to the post office."
        },
        {
          "prompt": "What does she need?",
          "options": [
            "A small box and a form",
            "A passport and a suitcase",
            "A book and a pen only",
            "A train ticket"
          ],
          "answerIndex": 0,
          "explanation": "She asks for a box and a form."
        },
        {
          "prompt": "What information must be written clearly?",
          "options": [
            "The receiver's name and address",
            "The sender's favourite food",
            "The weather",
            "The parcel's colour"
          ],
          "answerIndex": 0,
          "explanation": "The assistant asks for name and address."
        },
        {
          "prompt": "What does the student keep?",
          "options": [
            "The receipt",
            "The empty box",
            "The assistant's phone",
            "A timetable"
          ],
          "answerIndex": 0,
          "explanation": "She keeps the receipt."
        }
      ]
    },
    {
      "id": "en-c01-s02-l08",
      "title": "Course 1 · Semester 2 · Food, Shopping and Polite Requests",
      "level": "A1–A2",
      "script": "Customer: Good afternoon. Could I have a bottle of water and a cheese sandwich, please? Shop assistant: Certainly. Would you like anything else? Customer: No, thank you. How much is it? Shop assistant: It is four euros fifty. Customer: Can I pay by card? Shop assistant: Yes, of course. Here is your receipt.",
      "questions": [
        {
          "prompt": "What does the customer buy?",
          "options": [
            "Water and a cheese sandwich",
            "Coffee and soup",
            "Tea and cake",
            "Juice and fruit"
          ],
          "answerIndex": 0,
          "explanation": "The customer asks for water and a sandwich."
        },
        {
          "prompt": "How much does it cost?",
          "options": [
            "Four euros fifty",
            "Three euros",
            "Five euros fifty",
            "Four euros"
          ],
          "answerIndex": 0,
          "explanation": "The assistant says four euros fifty."
        },
        {
          "prompt": "How does the customer want to pay?",
          "options": [
            "By card",
            "In cash only",
            "By cheque",
            "With a travel ticket"
          ],
          "answerIndex": 0,
          "explanation": "The customer asks to pay by card."
        },
        {
          "prompt": "What does the assistant give?",
          "options": [
            "A receipt",
            "A timetable",
            "A map",
            "A library card"
          ],
          "answerIndex": 0,
          "explanation": "The assistant gives a receipt."
        }
      ]
    },
    {
      "id": "en-c01-s02-l09",
      "title": "Course 1 · Semester 2 · Present Continuous: Actions in Progress",
      "level": "A1–A2",
      "script": "Teacher: What are the students doing now? Student: Two students are reading, and one student is writing on the board. Teacher: What is the teacher doing? Student: She is explaining a new word. Teacher: Are the students talking? Student: No, they are listening carefully. Teacher: Good. Describe what is happening in the picture.",
      "questions": [
        {
          "prompt": "What are two students doing?",
          "options": [
            "Reading",
            "Running",
            "Eating",
            "Sleeping"
          ],
          "answerIndex": 0,
          "explanation": "Two students are reading."
        },
        {
          "prompt": "What is one student doing?",
          "options": [
            "Writing on the board",
            "Opening a window",
            "Playing football",
            "Drawing a map"
          ],
          "answerIndex": 0,
          "explanation": "One student is writing on the board."
        },
        {
          "prompt": "What is the teacher doing?",
          "options": [
            "Explaining a new word",
            "Leaving the room",
            "Making a phone call",
            "Reading a newspaper"
          ],
          "answerIndex": 0,
          "explanation": "The teacher is explaining a word."
        },
        {
          "prompt": "Are the students talking?",
          "options": [
            "No, they are listening",
            "Yes, loudly",
            "They are singing",
            "The recording does not say"
          ],
          "answerIndex": 0,
          "explanation": "The student says they are listening carefully."
        }
      ]
    },
    {
      "id": "en-c01-s02-l10",
      "title": "Course 1 · Semester 2 · Past Simple: Regular and Irregular Verbs",
      "level": "A1–A2",
      "script": "Last Saturday, Mark visited his grandparents. He travelled by bus and arrived at noon. His grandmother cooked lunch, and they talked about college. In the afternoon, Mark helped his grandfather in the garden. They planted flowers and watered the trees. Mark returned home in the evening. He enjoyed the day because he spent time with his family.",
      "questions": [
        {
          "prompt": "When did Mark visit his grandparents?",
          "options": [
            "Last Saturday",
            "Last Monday",
            "Yesterday morning",
            "Next weekend"
          ],
          "answerIndex": 0,
          "explanation": "The story begins last Saturday."
        },
        {
          "prompt": "How did he travel?",
          "options": [
            "By bus",
            "By train",
            "By car",
            "On foot"
          ],
          "answerIndex": 0,
          "explanation": "He travelled by bus."
        },
        {
          "prompt": "What did they do in the garden?",
          "options": [
            "Planted flowers and watered trees",
            "Built a house",
            "Painted a fence",
            "Played football"
          ],
          "answerIndex": 0,
          "explanation": "They planted flowers and watered trees."
        },
        {
          "prompt": "Why did Mark enjoy the day?",
          "options": [
            "He spent time with his family",
            "He bought a new phone",
            "He missed his bus",
            "He stayed at college"
          ],
          "answerIndex": 0,
          "explanation": "He enjoyed being with his family."
        }
      ]
    },
    {
      "id": "en-c01-s02-l11",
      "title": "Course 1 · Semester 2 · Countable and Uncountable Nouns",
      "level": "A1–A2",
      "script": "A student is preparing breakfast. She has two eggs, some bread and a little cheese. There is a bottle of milk in the fridge and three apples on the table. Her brother asks, Have we got any tea? She answers, Yes, there is some tea in the cupboard. They decide to make breakfast before leaving for college.",
      "questions": [
        {
          "prompt": "How many eggs are there?",
          "options": [
            "Two",
            "Three",
            "Four",
            "One"
          ],
          "answerIndex": 0,
          "explanation": "The student has two eggs."
        },
        {
          "prompt": "Where is the milk?",
          "options": [
            "In the fridge",
            "On the table",
            "In the cupboard",
            "In the bag"
          ],
          "answerIndex": 0,
          "explanation": "The milk is in the fridge."
        },
        {
          "prompt": "How many apples are on the table?",
          "options": [
            "Three",
            "Two",
            "Five",
            "One"
          ],
          "answerIndex": 0,
          "explanation": "There are three apples."
        },
        {
          "prompt": "Where is the tea?",
          "options": [
            "In the cupboard",
            "In the fridge",
            "On the floor",
            "In the classroom"
          ],
          "answerIndex": 0,
          "explanation": "The tea is in the cupboard."
        }
      ]
    },
    {
      "id": "en-c01-s02-l12",
      "title": "Course 1 · Semester 2 · Short Messages and Informal Emails",
      "level": "A1–A2",
      "script": "Hi Kate, I cannot meet you at the library today because I have an extra lesson. Can we meet tomorrow at four? Please bring the English workbook. I will bring my notes. Let me know if the time is good for you. See you, Anna. Kate replies that tomorrow is fine and she will be there at four.",
      "questions": [
        {
          "prompt": "Why can't Anna meet today?",
          "options": [
            "She has an extra lesson",
            "She is ill",
            "She is travelling",
            "The library is closed"
          ],
          "answerIndex": 0,
          "explanation": "Anna says she has an extra lesson."
        },
        {
          "prompt": "When do they plan to meet?",
          "options": [
            "Tomorrow at four",
            "Today at four",
            "Tomorrow at six",
            "Next Monday"
          ],
          "answerIndex": 0,
          "explanation": "Anna suggests tomorrow at four."
        },
        {
          "prompt": "What should Kate bring?",
          "options": [
            "The English workbook",
            "A passport",
            "A sports bag",
            "A laptop charger"
          ],
          "answerIndex": 0,
          "explanation": "Anna asks her to bring the workbook."
        },
        {
          "prompt": "What will Anna bring?",
          "options": [
            "Her notes",
            "A dictionary for Kate",
            "A camera",
            "A lunch box"
          ],
          "answerIndex": 0,
          "explanation": "Anna says she will bring her notes."
        }
      ]
    },
  ];

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = String(text);
    return n;
  }
  function esc(s) {
    return window.escapeHtml ? window.escapeHtml(String(s == null ? "" : s)) :
      String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]; });
  }
  function render() {
    var app = document.getElementById("app");
    if (!app) return;
    var courseId = String(window.state && window.state.activeCourseId || "");
    if (!window.state || (!window.state.student && !window.state.staff) ||
        (window.canAccessCourse && !window.canAccessCourse(courseId))) {
      app.innerHTML = '<section class="module">Войдите в портал и выберите доступный курс английского языка.</section>';
      return;
    }
    app.innerHTML = '<a class="backlink" href="#/">← На главную</a>' +
      '<section class="hero"><h1>English Listening Lab</h1><p>Курсы 1–5 · 10 семестровых блоков · 120 аудирований · браузерное озвучивание</p></section>' +
      '<section class="module"><p>Выберите аудирование. Браузер прочитает английский текст вслух. В тренировочном режиме после ответа доступны проверка и расшифровка. Это учебные упражнения, не экзаменационные попытки.</p></section>';
    var currentSemester = "";
    activities.forEach(function (activity) {
      var courseParts = activity.id.match(/en-c(\d+)-s(\d+)-/);
      var semester = courseParts ? "Курс " + Number(courseParts[1]) + " · Семестр " + Number(courseParts[2]) : "Аудирование";
      if (semester !== currentSemester) {
        currentSemester = semester;
        app.appendChild(el("h2", "section-title", semester));
      }
      var card = el("section", "module");
      card.appendChild(el("h2", "", activity.title));
      card.appendChild(el("p", "museum-muted", "Уровень: " + activity.level));
      var mount = el("div", "english-listening-mount");
      card.appendChild(mount);
      app.appendChild(card);
      window.EnglishListeningLesson.render(mount, {
        mode: "practice",
        script: activity.script,
        lang: "en-GB",
        repeatCount: 2,
        rate: 0.88,
        questions: activity.questions
      });
    });
  }

  window.EnglishListeningCatalogue = {
    render: render,
    count: activities.length,
    getById: function (id) {
      return activities.find(function (activity) { return activity.id === id; }) || null;
    }
  };
})();
