# Swasthya Share

Swasthya Share revolutionizes hospital operations by leveraging patient-doctor interaction audio inputs to generate comprehensive admission notes and treatment plans. This innovative approach enhances efficiency and fosters seamless communication among healthcare professionals, ultimately optimizing patient care.

# Problems Breakdown

Swasthya Share addresses several key challenges in the healthcare industry:

1. **Broken/Delayed Communication**: Traditional communication methods can lead to delays or breakdowns in conveying critical information among healthcare professionals, impacting patient care.

2. **Lots of Administrative Tasks for Doctors**: Doctors often spend significant time on administrative tasks such as documentation, which detracts from time spent on patient care.

3. **Lack of Accountability**: Without proper documentation and tracking systems, accountability in healthcare practices can be compromised, leading to errors or oversights.

4. **Undocumented**: Inadequate documentation of patient interactions, treatments, and progress can hinder continuity of care and decision-making processes.

5. **Hospital Data not Organized**: Disorganized hospital data management systems can result in inefficiencies, difficulty in accessing patient information, and increased risk of errors.

Swasthya Share aims to mitigate these challenges by streamlining processes, improving communication, and enhancing accountability through its innovative platform.


## Features:

- **Streamlined Hospital Operations**: Automate the generation of detailed admission notes and treatment plans.
- **Audio Input Integration**: Utilize patient-doctor interaction audio inputs to gather necessary information.
- **Efficiency Improvement**: Enhance efficiency by automating documentation processes.
- **Communication Enhancement**: Facilitate seamless communication among healthcare professionals.
- **Patient-Centric Approach**: Prioritize patient care by streamlining administrative tasks.



# Architecture Overview

[![current-architecture.png](https://i.postimg.cc/qvyWg08N/current-architecture.png)](https://postimg.cc/zyDxPs2N)

## Login Page:
The Login Page allows healthcare professionals to securely access the Swasthya Share system. Users are required to input their credentials to log in, ensuring confidentiality and security.

## Landing Page:
The Landing Page serves as the main interface for users after logging in. It provides essential functionalities such as recording patient-doctor conversations and accessing patient records. Healthcare professionals can seamlessly navigate through different sections of the platform from the Landing Page.

## Patient Report Page:
The Patient Report Page offers a detailed view of patient records, including admission notes and treatment plans. Healthcare professionals can review and manage patient data efficiently, enabling informed decision-making and personalized patient care.


## Technologies Used:

- **Frontend**: React.js
- **Backend**: Flask
- **Database**: MongoDB
- **Audio Processing**: MediaRecorder API
- **File Handling**: Blob and File APIs



## Installation:

1. Clone the repository:

   ```bash
      git clone ttps://github.com/codes-by-vamshi/MediConvoMonitor-FE.git
2. Install dependencies:

   ```bash
      cd login-page-MediConvoMonitor
      npm install
3. Run the application:
    ```bash
      npm start
## Usage:

1. Log in to the Swasthya Share system using your credentials.
2. Record patient-doctor conversations using the provided functionality.
3. Access patient records to view detailed admission notes and treatment plans.
4. Download and view generated PDFs for further reference.

## Contributors:

- Sai Krishna Vamshi Devarasetty
- Davang Sikand
- Nidugondi L N Sai Pranav
- Chirag Chaudhary

## License:

This project is licensed under the [License Name] License - see the [LICENSE.md](LICENSE.md) file for details.
