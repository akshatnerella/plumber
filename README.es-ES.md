

<p align="center">
  <img src="assets/plumber.png" width="200" alt="Plumber">
</p>

<h1 align="center">Plumber</h1>

<p align="center">
  <em>Un idiota admira la complejidad, un genio admira la simplicidad.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/github/stars/akshatnerella/plumber?style=flat-square&color=1a1a2e&label=stars" alt="Stars">
  <img src="https://img.shields.io/badge/works%20with-10%20agents-1a1a2e?style=flat-square" alt="Works with 10 agents">
  <img src="https://img.shields.io/badge/license-MIT-1a1a2e?style=flat-square" alt="MIT">
</p>

---

Tu agente de IA no arregla errores. Los parchea. Condicionales sobre condicionales, manejo de errores para cosas que no deberían ocurrir, complejidad añadida para combatir la complejidad existente. Cada ticket recibe una curita. El tubo sigue goteando.

**Plumber arregla el tubo.**

## Benchmarks

5 tareas. Mismo modelo. Mismo prompt. Vanilla vs Plumber.

| Tarea | LOC Δ | Condiciones Δ | Token Δ |
|------|:-----:|:------------:|:-------:|
| Manejador de solicitudes | -18% | -25% | ~+1% |
| Reintento con backoff | — | — | ~+1% |
| Cargador de configuración | — | — | +1.1% |
| Exportación multi-formato | +27% | -25% | +1.2% |
| Decorador de logging | +30% | — | +1.2% |
| **Promedio** | **+12%** | **-18%** | **~+1%** |

Plumber escribió **más líneas** en promedio — no menos. La métrica real son las condiciones: **-18% menos ramificaciones** en todas las tareas. El costo de tokens es insignificante (~1% de sobrecarga).

Las mayores mejoras no están en la tabla: eliminación de variables centinela, excepciones genéricas reemplazadas por específicas, listas codificadas reemplazadas por fórmulas, booleanos analizados de forma segura. Consulta [benchmarks/](benchmarks/) para ver los estudios de caso completos.

## Antes / después

**El fallo por null**

Reportas un fallo por null. Tu agente añade tres verificaciones de null.

```python
def get_user_name(user):
    if user is None:
        return "Unknown"
    if not hasattr(user, 'name'):
        return "Unknown"
    if user.name is None:
        return "Unknown"
    return user.name
```

Plumber encuentra la ruta no autenticada que nunca debería haber pasado un null aquí y la elimina en la fuente.

```python
# plumber: fixed the route guard — null shouldn't reach this function
def get_user_name(user):
    return user.name
```

---

**El guardián copiado y pegado**

La misma verificación termina en cada función porque nadie corrigió al llamante.

```python
def send_email(user):
    if not user.email_verified:
        return
    ...

def send_notification(user):
    if not user.email_verified:
        return
    ...

def send_sms(user):
    if not user.email_verified:
        return
    ...
```

Plumber coloca un único guardián donde corresponde y elimina el resto.

```python
# plumber: @require_verified_email on the route — unverified users never reach these
def send_email(user): ...
def send_notification(user): ...
def send_sms(user): ...
```

---

**El try/except fantasma**

Tu agente envuelve todo en try/except por si acaso.

```python
def get_config(key):
    try:
        return config[key]
    except KeyError:
        return None
    except TypeError:
        return None
    except AttributeError:
        return None
```

Plumber usa la única línea que ya proporciona la biblioteca estándar.

```python
def get_config(key):
    return config.get(key)
```

---

**La cadena de isinstance**

Tu agente hace que una función acepte "cualquier cosa" en lugar de corregir lo que la llama.

```python
def process(data):
    if isinstance(data, str):
        data = json.loads(data)
    elif isinstance(data, bytes):
        data = json.loads(data.decode())
    elif isinstance(data, list):
        data = {"items": data}
    return transform(data)
```

Plumber normaliza en el límite y mantiene la función limpia.

```python
# plumber: deserialize at the API layer — process() only ever sees a dict
def process(data: dict):
    return transform(data)
```

## Cómo funciona

Antes de tocar cualquier código, el agente ejecuta esto en silencio:

```
1. What is the actual problem?         (not the symptom)
2. Is this patch covering a design flaw?   → fix the design
3. Adding complexity to fight complexity?  → redesign
4. Handling cases that shouldn't exist?    → delete them
5. What can be removed?                → strip it
6. Simple or just compact?             short ≠ simple
7. Write the minimum. Refactor. Repeat.
```

Los rediseños se marcan con `plumber:` para que se lean como intención, no como accidente.

## Instalación

**Claude Code**
```
/plugin marketplace add akshatnerella/plumber
/plugin install plumber@plumber
```

Para Codex, Cursor, Windsurf, Cline, Kiro, Copilot, OpenCode y más, consulta [INSTALLATION.md](INSTALLATION.md).

## Comandos

| Comando | |
|---------|--|
| `/plumber [lite \| full \| ultra \| off]` | Establecer intensidad |
| `/plumber-diagnose` | Mostrar desglose de la causa raíz antes de actuar |
| `/plumber-review` | Marcar parches en el diff actual |
| `/plumber-audit` | Escanear todo el repositorio en busca de parches acumulados |

`/plumber ultra` para cuando la base de código te ha ofendido personalmente.

---

[MIT](LICENSE)
