import { createApp } from 'vue'
import axios from 'axios'

createApp({
   // el: '#app',
    data() { 
        return  {
        students: [], 
        search: '',
        theme: 'light',
        editingStudent: null,
        editedName: "",
        editedGroup: "",
        editedMark: 0,
        editedIsDonePr: false,
        editedPhoto: "", 
        showingAddForm: false,
        newStudentName: "",
        newStudentGroup: "",
        newStudentMark: 0,
        newStudentIsDonePr: false,
        newStudentPhoto: "https://robohash.org/default",
    };
    },
    computed: {
        filteredStudents() {
            const searchTerm = this.search.toLowerCase();
            return this.students.map(student => {
                const highlighted = searchTerm && student.name.toLowerCase().includes(searchTerm);
                return { ...student, highlighted };
            });
        }
    },
    methods: {
        loadStudentsFromAPI() {
            const apiUrl = 'http://34.82.81.113:3000/students';

            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    this.students = data;
                })
                .catch(error => {
                    console.error('Помилка при завантаженні даних з API:', error);
                });
        },
        removeStudent(id) {

            const apiUrl = `http://34.82.81.113:3000/students/${id}`;

            fetch(apiUrl, {
                method: 'DELETE'
            })
            .then(response => {
                if (response.ok) {
                    const index = this.students.findIndex(student => student._id === id);
                    if (index !== -1) {
                        this.students.splice(index, 1);
                    }
                }
            })
            .catch(error => {
                console.error('Помилка при видаленні студента з API:', error);
            });
        },
        saveStudent(student) {
// Оновлюємо дані студента на сервері
const apiUrl = `http://34.82.81.113:3000/students/${student._id}`;

const updatedStudentData = {
name: this.editedName,
group: this.editedGroup,
mark: this.editedMark,
isDonePr: this.editedIsDonePr,
photo: student.photo, // Встановлюємо фото назад таким, яким воно було
};

fetch(apiUrl, {
method: 'PUT',
headers: {
    'Content-Type': 'application/json'
},
body: JSON.stringify(updatedStudentData)
})
.then(response => {
if (response.ok) {
    student.name = this.editedName;
    student.group = this.editedGroup;
    student.mark = this.editedMark;
    student.isDonePr = this.editedIsDonePr;
    this.cancelEdit();
}
})
.catch(error => {
console.error('Помилка при збереженні студента на сервері:', error);
});
},
        cancelEdit() {
            this.editingStudent = null;
            this.editedName = "";
            this.editedGroup = "";
            this.editedMark = 0;
            this.editedIsDonePr = false;
        },
        isEditing(student) {
            return this.editingStudent === student;
        },
        editStudent(student) {
if (this.isEditing(student)) {
this.saveStudent(student);
}
this.editingStudent = student;
this.editedName = student.name;
this.editedGroup = student.group;
this.editedMark = student.mark;
this.editedIsDonePr = student.isDonePr;
this.editedPhoto = student.photo; // Додавання цього рядку для збереження фото студента при редагуванні
},

        showAddForm() {
            this.showingAddForm = true;
        },
        addStudent() {
            const newStudent = {
                name: this.newStudentName,
                group: this.newStudentGroup,
                mark: this.newStudentMark,
                isDonePr: this.newStudentIsDonePr,
                photo: this.newStudentPhoto,
            };

            fetch('http://34.82.81.113:3000/students', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newStudent)
            })
            .then(response => response.json())
            .then(data => {
                newStudent._id = data._id;
                this.students.push(newStudent);

                this.newStudentName = "";
                this.newStudentGroup = "";
                this.newStudentMark = 0;
                this.newStudentIsDonePr = false;
                this.newStudentPhoto = "https://robohash.org/default";
                this.showingAddForm = false;
            })
            .catch(error => {
                console.error('Помилка при додаванні студента на сервер:', error);
            });
        },
        cancelAdd() {
            this.newStudentName = "";
            this.newStudentGroup = "";
            this.newStudentMark = 0;
            this.newStudentIsDonePr = false;
            this.newStudentPhoto = "https://robohash.org/default";
            this.showingAddForm = false;
        },
    
    },
    watch: {
        theme(newTheme) {
            if (newTheme === 'dark') {
                document.body.classList.add('dark-theme');
            } else {
                document.body.classList.remove('dark-theme');
            }
            localStorage.setItem('theme', newTheme);
        }
    },
    created() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.loadStudentsFromAPI();
    },
}).mount('#app')
