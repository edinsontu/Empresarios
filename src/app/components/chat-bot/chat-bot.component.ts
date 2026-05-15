import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-chat-bot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-bot.component.html',
  styleUrls: ['./chat-bot.component.css']
})
export class ChatBotComponent {
  isOpen = false;
  messages: { from: 'bot' | 'user', text: string }[] = [];
  step = 0;
  questions: any[] = [];

  constructor(private router: Router) {
    // Escucha los cambios de ruta
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.resetChat();
        this.loadQuestionsByRoute();
      });

    this.loadQuestionsByRoute(); // Cargar preguntas al inicio
  }

  // Reinicia el estado del chat
  resetChat() {
    this.messages = [];
    this.step = 0;
    this.isOpen = false;
  }

  // Cambia las preguntas según la ruta
  loadQuestionsByRoute() {
    const currentUrl = this.router.url;

    if (currentUrl.includes('/emprendedor/dashboard')) {
      this.questions = this.getEmprendedorQuestions();
    } else if (currentUrl.includes('/cliente/dashboard')) {
      this.questions = this.getClientQuestions();
    } else {
      this.questions = this.getDefaultQuestions();
    }
  }

  // Preguntas para visitantes
  getDefaultQuestions() {
    return [
      {
        question: '¿En qué te puedo ayudar hoy?',
        options: [
          '¿Cómo puedo empezar si soy microemprendedor?',
          '¿Qué puedo hacer desde esta página?',
          '¿Cómo puedo empezar si soy cliente?',
          '¿Esta plataforma tiene algún costo para los emprendedores?',
          'Registrarme',
          'Contactar soporte',
        ]
      },
      {
        question: '¿Te gustaría registrarte como?',
        options: ['Cliente', 'Emprendedor']
      }
    ];
  }

  // Preguntas para cliente
  getClientQuestions() {
    return [
      {
        question: 'Hola 👋 ¿En qué puedo ayudarte Cliente?',
        options: [
          '¿Cómo puedo ver los productos disponibles?',
          '¿Dónde veo la información del producto?',
          '¿Cómo contacto al emprendedor si me interesa un producto?',
          '¿Debo registrarme para poder ver los productos?',
          'Contactar soporte'
        ]
      }
    ];
  }

  // Preguntas para emprendedor
  getEmprendedorQuestions() {
    return [
      {
        question: 'Hola 👋 ¿En qué puedo ayudarte Emprendedor?',
        options: [
          ' ¿Cómo puedo registrar mis productos en la plataforma?',
          '¿Puedo editar o eliminar productos ya publicados? ¿Cómo lo hago?',
          '¿Puedo subir fotos y videos de mis productos? ¿Cómo lo hago?',
          'Contactar soporte'
        ]
      }
    ];
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    if (this.isOpen && this.messages.length === 0) {
      this.messages.push({ from: 'bot', text: this.questions[0].question });
    }
  }

  selectOption(option: string) {
    this.messages.push({ from: 'user', text: option });

    // VISITANTE
    if (this.router.url === '/' || (!this.router.url.includes('dashboard'))) {
      if (this.step === 0) {
        if (option === 'Registrarme') {
          this.messages.push({ from: 'bot', text: this.questions[1].question });
          this.step = 1;
          return;
        } else if (option === '¿Cómo puedo empezar si soy microemprendedor?') {
          this.messages.push({ from: 'bot', text: 'Solo debes registrarte, crear tu perfil y comenzar a subir tus productos o servicios. Es sencillo, rápido y gratuito.' });
        } else if (option === '¿Qué puedo hacer desde esta página?') {
          this.messages.push({ from: 'bot', text: 'Puedes explorar emprendimientos, buscar productos, registrarte como emprendedor o cliente, y obtener ayuda del chatbot en cualquier momento.' });
        } else if (option === '¿Cómo puedo empezar si soy cliente?') {
          this.messages.push({ from: 'bot', text: 'Solo debes registrarte, crear tu perfil y comenzar a explorar productos.' });
        } else if (option === '¿Esta plataforma tiene algún costo para los emprendedores?') {
          this.messages.push({ from: 'bot', text: 'No, registrarse y publicar productos es completamente gratuito.' });
        } else if (option === 'Contactar soporte') {
          this.messages.push({ from: 'bot', text: 'Por favor escríbenos a maraqued@ufpso.edu.co o usa WhatsApp +57 322 9013065.' });
        }
      } else if (this.step === 1) {
        if (option === 'Cliente') {
          this.messages.push({ from: 'bot', text: 'Puedes registrarte como cliente desde la sección de registro.' });
        } else if (option === 'Emprendedor') {
          this.messages.push({ from: 'bot', text: 'Perfecto, ve a "Registro" y selecciona emprendedor.' });
        }
      }
    }

    // CLIENTE
    else if (this.router.url.includes('/cliente/dashboard')) {
      if (option === '¿Cómo puedo ver los productos disponibles?') {
        this.messages.push({ from: 'bot', text: 'Puedes navegar por la página principal o usar el buscador para encontrar productos según lo que necesites.' });
      } else if (option === '¿Dónde veo la información del producto?') {
        this.messages.push({ from: 'bot', text: 'Haz clic sobre cualquier producto y verás su nombre, precio, descripción y fotos.' });
      } else if (option === '¿Cómo contacto al emprendedor si me interesa un producto?') {
        this.messages.push({ from: 'bot', text: 'Cada producto tiene un botón de WhatsApp. Solo tócalo y podrás escribirle directamente al vendedor.' });
      } else if (option === '¿Debo registrarme para poder ver los productos?') {
        this.messages.push({ from: 'bot', text: 'Sí, para acceder a las funciones debes registrarte.' });
      } else if (option === 'Contactar soporte') {
        this.messages.push({ from: 'bot', text: 'Escríbenos a maraqued@ufpso.edu.co o usa WhatsApp +57 322 9013065.' });
      }
    }

    // EMPRENDEDOR
    else if (this.router.url.includes('/emprendedor/dashboard')) {
      if (option === ' ¿Cómo puedo registrar mis productos en la plataforma?') {
        this.messages.push({ from: 'bot', text: 'Una vez registrado como microemprendedor, desde tu perfil puedes agregar productos fácilmente. Solo debes ir a la opción “Agregar producto”, ingresar el nombre, la descripción, el precio y seleccionar una categoría. Así tu emprendimiento estará visible para los clientes que accedan.' });
      } else if (option === '¿Puedo editar o eliminar productos ya publicados? ¿Cómo lo hago?') {
        this.messages.push({ from: 'bot', text: 'Sí, puedes editar o eliminar productos en cualquier momento. Entra a tu perfil, busca el producto que quieras modificar y selecciona “Editar” para cambiar la información o “Eliminar” si ya no lo necesitas.' });
      } else if (option === '¿Puedo subir fotos y videos de mis productos? ¿Cómo lo hago?') {
        this.messages.push({ from: 'bot', text: 'Sí, al momento de agregar o editar un producto, la plataforma te permite subir imágenes desde tu dispositivo. Solo haz clic en “Subir imagen” y selecciona una foto llamativa de tu producto.' });
      } else if (option === 'Contactar soporte') {
        this.messages.push({ from: 'bot', text: 'Escríbenos a maraqued@ufpso.edu.co o usa WhatsApp +57 322 9013065.' });
      }
    }
  }
}
